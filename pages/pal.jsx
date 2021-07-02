import React from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Tooltip,
  Grid,
  TextField,
  Button,
  Paper,
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout/Layout';
import PageHero from '../components/Sections/PageHero';
import IconContainer from '../components/Container/IconContainer';
import PersonIcon from '@material-ui/icons/Person';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { colors } from '../constants/design';
import SchemeResultCard from '../components/Card/SchemeResultCard';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { createFormData } from '../utils';
import CircularProgress from '@material-ui/core/CircularProgress';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
    padding: '0.4rem 0.8rem',
    lineHeight: '20px',
  },
}))(Tooltip);

const useStyles = makeStyles(() => ({
  btnText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const Pal = ({ queryResults, query }) => {
  const classes = useStyles();
  const [searchResults, setSearchResults] = React.useState(queryResults);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);

  React.useEffect(async () => {
    if (query) {
      const scriptURLpalquery =
        'https://script.google.com/macros/s/AKfycbwgKnPhUBHnlGJ3YudlSeaMfjUe9mPaI-N3Sbz9uar52oDDFf0/exec';

      fetch(scriptURLpalquery, {
        method: 'POST',
        body: createFormData(query),
      })
        .then((response) => console.log('Done!', response))
        .catch((error) => console.error('Error!', error.message));
    }
  }, []);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await axios.post(
      'https://schemessg-v2.herokuapp.com/schemespredict',
      { query: value }
    );

    const data = await res.data;

    setSearchResults(data);
    setLoading(false);

    const scriptURLpalquery =
      'https://script.google.com/macros/s/AKfycbwgKnPhUBHnlGJ3YudlSeaMfjUe9mPaI-N3Sbz9uar52oDDFf0/exec';

    fetch(scriptURLpalquery, {
      method: 'POST',
      body: createFormData({ Query: value }),
    })
      .then((response) => console.log('Done!', response.status))
      .catch((error) => console.error('Error!', error.message));

    const url = new URL(window.location);
    url.searchParams.set('query', value);
    window.history.pushState({}, '', url);
  };

  return (
    <>
      <Layout title='Schemes Pal |Schemes SG'>
        <PageHero
          title='Schemes Pal'
          subtitle='AI-powered search to retrieve relevant assistance listings.'
        />
        <Container
          maxWidth='lg'
          style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} md={6}>
              <Typography variant='h4' gutterBottom>
                How to use
              </Typography>
              <div className='feature-description'>
                <IconContainer icon={<PersonIcon style={{ width: 20 }} />} />
                <Typography variant='body1' style={{ marginLeft: 12 }}>
                  Indicate your beneficiary's/your profile (e.g. "elderly with
                  healthcare needs").
                  <br />
                  <strong>DO NOT</strong> give identifiable info like NRIC or
                  name.{' '}
                  <ClickAwayListener onClickAway={handleTooltipClose}>
                    <LightTooltip
                      title='We record the query text but only for a short period of time. This is to train the AI model and improve its accuracy to serve you better. We are unable to identify the individuals who entered the query or who it refers to. You can help us ensure an even greater level of security by not providing names or identifiable detail.'
                      placement='right'
                      onClose={handleTooltipClose}
                      open={open}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener>
                      <span
                        className='tooltip-text'
                        onClick={handleTooltipOpen}>
                        Important: please read this.
                      </span>
                    </LightTooltip>
                  </ClickAwayListener>
                </Typography>
              </div>
              <div className='feature-description'>
                <IconContainer
                  icon={<RecordVoiceOverIcon style={{ width: 20 }} />}
                />
                <Typography variant='body1' style={{ marginLeft: 12 }}>
                  Tell us the assistance you need.
                  <br />
                  The more specific you are (e.g. "financial assistance for
                  dialysis"), the better the search.
                </Typography>
              </div>
              <div className='feature-description'>
                <IconContainer icon={<ThumbUpIcon style={{ width: 20 }} />} />
                <Typography variant='body1' style={{ marginLeft: 12 }}>
                  Example of a good search:
                  <br />"
                  <u>
                    My client needs assistance as a dialysis patient. She is
                    also in need of a job and financial support after COVID 19
                    has caused her to be retrenched.
                  </u>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3}>
                <form className='query-container' onSubmit={handleSubmit}>
                  <TextField
                    id='outlined-full-width'
                    label='Tell us a few word'
                    rows={5}
                    multiline
                    name='query'
                    value={value}
                    onChange={handleChange}
                    variant='outlined'
                    fullWidth
                  />
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disableElevation
                    style={{ marginTop: '1rem' }}
                    disabled={loading}>
                    <Typography variant='subtitle1' className={classes.btnText}>
                      {loading ? <CircularProgress style={{ height: 20, width: 20 }} /> : "Search"}
                    </Typography>
                  </Button>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        {!!searchResults && searchResults !== 'nil' && searchResults.data && (
          <div className='search-results-container' id='search-results'>
            {loading ? (
              <p>loading...</p>
            ) : (
              <Container maxWidth='lg'>
                <Typography
                  variant='h5'
                  color='primary'
                  style={{ fontWeight: 700, marginBottom: '1rem' }}>
                  Search Results
                </Typography>
                <Grid container spacing={3}>
                  {searchResults.data.map((result) => (
                    <Grid item xs={12} sm={6} lg={4}>
                      <SchemeResultCard
                        scheme={result.Scheme}
                        agency={result.Agency}
                        description={result.Description}
                        image={result.Image}
                        link={result.Link}
                        relevance={result.Relevance}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Button
                  type='button'
                  variant='outlined'
                  color='primary'
                  disableElevation
                  onClick={() => window.scrollTo({ top: 0 })}
                  style={{ marginTop: '2rem' }}>
                  <Typography variant='subtitle1'>Back to Top</Typography>
                </Button>
              </Container>
            )}
          </div>
        )}
        <Container maxWidth='lg'>
          <div className='disclaimer'>
            <Typography variant='h6' style={{ fontWeight: 700 }}>
              Please note
            </Typography>
            <Typography variant='body1'>
              Schemes SG is only an <strong>aggregator</strong> of public domain
              listings and crowdsourcing. We are not a VWO, nor any
              assistance-giving body, and we do not guarantee successful
              application of any schemes listed above. Schemes Pal only serves
              to help you make sense of existing schemes out there. The Schemes
              Pal engine is <strong>still being upgraded</strong>.
            </Typography>
          </div>
        </Container>
      </Layout>

      <style jsx>
        {`
          .Pal-root {
            position: relative;
          }

          .feature-description {
            display: flex;
            align-items: center;
            margin: 1.4rem auto;
            text-align: left;
          }

          .tooltip-text {
            cursor: pointer;
            color: ${colors.primary.dark};
          }

          .tooltip-text:hover {
            opacity: 0.8;
          }

          form {
            padding: 2rem;
            text-align: center;
          }

          .search-results-container {
            text-align: center;
            padding: 3rem 0;
            background-color: ${colors.background.light};
          }

          .disclaimer {
            display: inline-block;
            margin: 3rem 0;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: ${colors.error.main};
            border: 1px solid ${colors.error.main};
          }
        `}
      </style>
    </>
  );
};

export async function getServerSideProps(context) {
  const res = await axios.post(
    'https://schemessg-v2.herokuapp.com/schemespredict',
    context.query
  );

  const queryResults = await res.data;
  return {
    props: {
      queryResults,
      query: context.query.query ? { Query: context.query.query } : null,
    },
  };
}

export default Pal;
