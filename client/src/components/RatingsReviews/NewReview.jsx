import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Modal,
  Button,
  Typography,
  FormControl,
  FormLabel,
  FormHelperText,
  TextField
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import UploadPhotos from './UploadPhotos.jsx';
import FormRating from './Form/FormRating.jsx';
import FormSummary from './Form/FormSummary.jsx';
import FormBody from './Form/FormBody.jsx';
import FormRecommend from './Form/FormRecommend.jsx';
import FormCharacteristics from './Form/FormCharacteristics.jsx';
import FormName from './Form/FormName.jsx';
import FormEmail from './Form/FormEmail.jsx';
import FormPhotos from './Form/FormPhotos.jsx';

const useStyles = makeStyles({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '75vh',
    overflow: 'auto',
    width: '75vw',
    'background-color': 'white',
    border: '2px solid #000',
    boxShadow: 24
  }
});

const NewReview = ({ productId, characteristics }) => {
  const [open, setOpen] = useState(false);
  const reviewObj = {
    product_id: productId,
    rating: 0,
    summary: '',
    body: '',
    recommend: null,
    name: '',
    email: '',
    photos: [],
    characteristics: {}
  };
  const [review, setReview] = useState(reviewObj);
  const classes = useStyles();

  const handleFormChange = (key, value, charKey) => {
    if (key === 'characteristics') {
      setReview({ ...review, [key]: { ...review[key], [charKey]: value } });
    } else {
      setReview({ ...review, [key]: value });
    }
  };

  const postReview = () => {
    axios
      .post('/api/reviews', review)
      .then(() => {
        console.log('Posted review');
      })
      .catch(() => {
        console.log('Error posting review');
      });
  };

  const handleSubmit = (data) => {
    setReview({ ...data, characteristics: review[characteristics] });
    postReview();
  };

  const charArray = Object.entries(characteristics);

  const validationSchema = yup.object({
    rating: yup.number().required('Rating required').min(1, 'Rating required'),
    summary: yup.string().max(60, 'Must be less than 60 characters'),
    body: yup.string().required('Body required').min(50, 'Must be more than 50 characters').max(1000, 'Must be less than 1000 characters'),
    recommend: yup.mixed().required('Must select an option'),
    name: yup.string().required('Name required').max(60, 'Must be less than 60 characters'),
    email: yup.string().required('Email required').email('Invalid email address').max(60, 'Must be less than 60 characters'),
    // photos: yup.array().of(yup.string().url()),
  });

  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)}>Write New Review</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Grid className={classes.modal} container spacing={2}>
          <Formik
            validateOnChange={true}
            initialValues={{
              product_id: productId,
              rating: 0,
              summary: '',
              body: '',
              recommend: null,
              name: '',
              email: '',
              photos: [],
            }}
            validationSchema={validationSchema}
            onSubmit={data => {
              console.log('submit: ', data);
              handleSubmit(data);
            }}
          >
            {({ submitForm, touched, values, errors, isSubmitting }) => (
              <Form>
                <Grid item xs={12}>
                  <Field component={FormRating} name='rating'/>
                </Grid>
                <Grid item xs={12}>
                  <Field component={FormSummary} type='text' name='summary' />
                </Grid>
                <Grid item xs={12}>
                  <Field component={FormBody} type='text' name='body' />
                </Grid>
                <Grid item xs={12}>
                  <Field component={FormRecommend} name='recommend' />
                </Grid>
                <Grid item xs={12}>
                  <FormCharacteristics
                    charArray={charArray}
                    characteristics={review.characteristics}
                    handleFormChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field component={FormPhotos} name='photos' />
                </Grid>
                <Grid item xs={12}>
                  <Field component={FormName} type='text' name='name' />
                </Grid>
                <Grid item xs={12}>
                  <Field component={FormEmail} type='email' name='email' />
                </Grid>
                <Grid item xs={12}>
                  <Button variant='outlined' onClick={submitForm}>
                    Submit Review
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Modal>
    </React.Fragment>
  );
};

export default NewReview;
