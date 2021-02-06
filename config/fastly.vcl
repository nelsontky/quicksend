sub vcl_recv {
  set req.enable_segmented_caching = true;

  /* unset state tracking header to avoid client sending it */
  if (req.restarts == 0) {
    unset req.http.X-Authed;
  }

  if (!req.http.X-Authed) {
    /* stash the original URL and Host for later */
    set req.http.X-Orig-URL = req.url;

    /* set the URL to what the auth backend expects */
    set req.backend = F_Host_2;
    set req.url = querystring.set(
        "/api/v1/files/auth", 
        "downloadKey", 
        querystring.get(req.url, "downloadKey")
    );

    /* Auth requests won't be cached, so pass */
    return(pass);
  }

  if (req.http.X-Authed == "true") {
    /* were authed, so proceed with the request */
    /* reset the URL */
    set req.url = req.http.X-Orig-URL;

  } else {
    /* the auth backend refused the request, so 403 the client */
    error 403;
  }

#FASTLY recv

  # Normally, you should consider requests other than GET and HEAD to be uncacheable
  # (to this we add the special FASTLYPURGE method)
  if (req.method != "HEAD" && req.method != "GET" && req.method != "FASTLYPURGE") {
    return(pass);
  }

  return(lookup);
}

sub vcl_hash {
#FASTLY hash
  set req.hash += req.http.host;
  set req.hash += req.url;
  return(hash);
}

sub vcl_hit {
#FASTLY hit
  return(deliver);
}

sub vcl_miss {
  declare local var.b2AccessKey STRING;
  declare local var.b2SecretKey STRING;
  declare local var.b2Bucket STRING;
  declare local var.b2Region STRING;
  declare local var.canonicalHeaders STRING;
  declare local var.signedHeaders STRING;
  declare local var.canonicalRequest STRING;
  declare local var.canonicalQuery STRING;
  declare local var.stringToSign STRING;
  declare local var.dateStamp STRING;
  declare local var.signature STRING;
  declare local var.scope STRING;

  set var.b2AccessKey = "";
  set var.b2SecretKey = "";
  set var.b2Bucket = "quicksend-1";
  set var.b2Region = "us-west-000";

  if (req.method == "GET" && !req.backend.is_shield) {

    set bereq.http.x-amz-content-sha256 = digest.hash_sha256("");
    set bereq.http.x-amz-date = strftime({"%Y%m%dT%H%M%SZ"}, now);
    set bereq.http.host = var.b2Bucket ".s3." var.b2Region ".backblazeb2.com";
    set bereq.url = querystring.remove(bereq.url);
    set bereq.url = regsuball(urlencode(urldecode(bereq.url.path)), {"%2F"}, "/");
    set var.dateStamp = strftime({"%Y%m%d"}, now);
    set var.canonicalHeaders = ""
      "host:" bereq.http.host LF
      "x-amz-content-sha256:" bereq.http.x-amz-content-sha256 LF
      "x-amz-date:" bereq.http.x-amz-date LF
    ;
    set var.canonicalQuery = "";
    set var.signedHeaders = "host;x-amz-content-sha256;x-amz-date";
    set var.canonicalRequest = ""
      "GET" LF
      bereq.url.path LF
      var.canonicalQuery LF
      var.canonicalHeaders LF
      var.signedHeaders LF
      digest.hash_sha256("")
    ;

    set var.scope = var.dateStamp "/" var.b2Region "/s3/aws4_request";

    set var.stringToSign = ""
      "AWS4-HMAC-SHA256" LF
      bereq.http.x-amz-date LF
      var.scope LF
      regsub(digest.hash_sha256(var.canonicalRequest),"^0x", "")
    ;

    set var.signature = digest.awsv4_hmac(
      var.b2SecretKey,
      var.dateStamp,
      var.b2Region,
      "s3",
      var.stringToSign
    );

    set bereq.http.Authorization = "AWS4-HMAC-SHA256 "
      "Credential=" var.b2AccessKey "/" var.scope ", "
      "SignedHeaders=" var.signedHeaders ", "
      "Signature=" + regsub(var.signature,"^0x", "")
    ;
    unset bereq.http.Accept;
    unset bereq.http.Accept-Language;
    unset bereq.http.User-Agent;
    unset bereq.http.Fastly-Client-IP;
  }

#FASTLY miss
  return(fetch);
}

sub vcl_pass {
#FASTLY pass
  return(pass);
}

sub vcl_fetch {
#FASTLY fetch

  # Unset headers that reduce cacheability for images processed using the Fastly image optimizer
  if (req.http.X-Fastly-Imageopto-Api) {
    unset beresp.http.Set-Cookie;
    unset beresp.http.Vary;
  }

  # In the event of a server-failure response from origin, retry once more
  if ((beresp.status == 500 || beresp.status == 503) && req.restarts < 1 && (req.method == "GET" || req.method == "HEAD") && !req.http.X-Fastly-Imageopto-Api) {
    restart;
  }

  # Log the number of restarts for debugging purposes
  if (req.restarts > 0) {
    set beresp.http.Fastly-Restarts = req.restarts;
  }

  # If the response is setting a cookie, make sure it is not cached
  if (beresp.http.Set-Cookie) {
    return(pass);
  }

  # By default we set a TTL based on the `Cache-Control` header but we don't parse additional directives
  # like `private` and `no-store`.  Private in particular should be respected at the edge:
  if (beresp.http.Cache-Control ~ "(private|no-store)") {
    return(pass);
  }

  # If no TTL has been provided in the response headers, set a default
  if (!beresp.http.Expires && !beresp.http.Surrogate-Control ~ "max-age" && !beresp.http.Cache-Control ~ "(s-maxage|max-age)") {
    set beresp.ttl = 3600s;

    # Apply a longer default TTL for images processed using Image Optimizer
    if (req.http.X-Fastly-Imageopto-Api) {
      set beresp.ttl = 2592000s; # 30 days
      set beresp.http.Cache-Control = "max-age=2592000, public";
    }
  }

  return(deliver);
}

sub vcl_error {
#FASTLY error
  return(deliver);
}

sub vcl_deliver {
  /* if we are in the auth phase */
  if (!req.http.X-Authed) {

    /* if we got a 5XX from the auth backend, we should fail open */
    if (resp.status >= 500 && resp.status < 600) {
      set req.http.X-Authed = "true";
    }

    if (resp.status == 200) {

      /* the auth backend responded with 200, allow the request and restart */
      set req.http.X-Authed = "true";
    } else if (resp.status == 401) {

      return(deliver);

    } else {

      /* the auth backend responded with non-200, deny the request and restart */
      set req.http.X-Authed = "false";
    }

    restart;
  }
  
#FASTLY deliver
  return(deliver);
}

sub vcl_log {
#FASTLY log
}
