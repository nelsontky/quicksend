import { Container, Box } from "@material-ui/core";
import Markdown from "../components/MarkDown";
import Typography from "../components/Typography";

const terms = `Last modified: January 31st, 2021.

## How long will my files be online?

- There is no limit to the amount of time your file is stored on our servers,
  unless the file violates our [Terms of Use](/terms).

## What are the upload limits?

- There are no limits, except for a maximum file size of 20GB.

## What are the restrictions on downloads?

- We do not enforce any bandwidth limitations on downloads.

## How do I manage my files?

- We will be launching an accounts feature very soon! Do continue visiting us
  and you will know when the feature is released!

`;

export default function Terms() {
  return (
    <Container>
      <Box padding={8}>
        <Typography variant="h3" gutterBottom marked="center" align="center">
          Frequently Asked Questions
        </Typography>
        <Markdown>{terms}</Markdown>
      </Box>
    </Container>
  );
}
