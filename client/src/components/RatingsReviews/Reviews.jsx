import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReviewList from './ReviewList.jsx';
import ProductBreakdown from './ProductBreakdown.jsx';
import RatingsBreakdown from './RatingsBreakdown.jsx';
import SortingDropdown from './SortingDropdown.jsx';
import NewReview from './NewReview.jsx';

const Reviews = ({ handleClick, currentProduct, productMeta }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selected, setSelected] = useState('relevant');

  const useStyles = makeStyles({
    list: {
      maxHeight: '103vh',
      overflow: 'auto'
    },
    title: {
      fontSize: '20px',
      padding: '10px',
      margin: '10px',
    }
  });

  const classes = useStyles();

  useEffect(() => {
    const totalReviews = Object.values(productMeta.ratings).reduce(
      (sum, val) => sum + Number(val),
      0
    );
    axios
      .get(
        `/api/reviews?product_id=${currentProduct.id}&count=${totalReviews}&sort=${selected}`
      )
      .then(({ data }) => {
        setReviews(data.results);
        setFilteredReviews(data.results);
      })
      .catch(() => {
        console.log('error getting reviews');
      });
  }, [productMeta, selected]);

  useEffect(() => {
    const reviewsToRender = [...reviews].filter(review => {
      if (filters.length > 0) {
        return filters.includes(review.rating);
      } else {
        return review;
      }
    });
    setFilteredReviews(reviewsToRender);
  }, [filters]);

  const filterReviews = rating => {
    const ratingIndex = filters.indexOf(rating);
    if (ratingIndex >= 0) {
      const updatedFilters = [...filters];
      updatedFilters.splice(ratingIndex, 1);
      setFilters(updatedFilters);
    } else {
      setFilters([...filters, rating]);
    }
  };

  const removeFiltersButton =
    filters.length > 0 ? (
      <Button variant='outlined' onClick={() => setFilters([])}>
        Remove Filters
      </Button>
    ) : null;

  const filterMessage =
    filters.length > 0 ? (
      <Typography>
        Applied filter(s){': '}
        {filters.map((filter, index) => {
          if (index === filters.length - 1) {
            return `${filter}`
          } else {
            return `${filter}, `;
          }
        })}
      </Typography>
    ) : null;

  if (reviews.length === 0) {
    return (
      <div onClick={(e) => handleClick(e, 'Reviews')}>
        <Typography className={classes.title} id='reviews' variant='h4' gutterBottom>RATINGS & REVIEWS</Typography>
        <NewReview
          productId={currentProduct.id}
          characteristics={productMeta.characteristics}
        />
      </div>
    );
  } else {
    return (
      <div onClick={(e) => handleClick(e, 'Reviews')}>
        <Typography className={classes.title} id='reviews' variant='h4' gutterBottom>RATINGS & REVIEWS</Typography>
        <Grid container spacing={2}>
          <Grid item xs={3} container spacing={1}>
            <Grid item xs={12}>
              <RatingsBreakdown
                productMeta={productMeta}
                filterReviews={filterReviews}
              />
            </Grid>
            <Grid item xs={12}>
              {filterMessage}
            </Grid>
            <Grid item xs={12}>
              {removeFiltersButton}
            </Grid>
            <Grid item xs={12}>
              <ProductBreakdown productMeta={productMeta} />
            </Grid>
          </Grid>
          <Grid className={classes.list} item xs={9} container>
            <Grid item xs={12}>
            <SortingDropdown selected={selected} setSelected={setSelected} />
            </Grid>
            <Grid item xs={12}>
            <ReviewList
              reviews={filteredReviews}
              currentProduct={currentProduct}
              selected={selected}
              characteristics={productMeta.characteristics}
            />
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default Reviews;
