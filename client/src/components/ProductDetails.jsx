import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    padding: "20px"
  },

  category: {
    fontWeight: "700"
  },

  reviewsLink: {
    marginLeft: "10px",
    textDecoration: "underline"
  },

  salePrice: {
    color: "red"
  },

  lineThrough: {
    textDecoration: "line-through",
  },

  temp: {
    minHeight: "200px",
    border: "dotted 1px grey",
    marginBottom: "20px"
  }
})

const getRatingInfo = (ratings) => {
  let total = 0;
  let count = 0;

  for (let rating in ratings) {
    let ratingInt = parseInt(rating)
    let ratingVal = parseInt(ratings[rating])
    total += ratingInt * ratingVal
    count += ratingVal
  }

  console.log('avgRating:', (total / (count * 5)) * count);
  console.log('totRatings:', count);

  return {
    avgProductRating: (total / (count * 5)) * count,
    totalRatings: count
  }
};

const ProductDetails = ({currentProduct, productStyles, styleIndex, changeStyle}) => {
  const classes = useStyles();
  const [ratingsInfo, setRatingsInfo] = useState(null)

  let productId = currentProduct.id;

  useEffect(() => {
    axios.get(`api/reviews/meta?product_id=${productId}`)
    .then(({ data }) => {
      setRatingsInfo(getRatingInfo(data.ratings))
    }).catch((err) => {
      console.log('Unable to retrieve ratings info', err);
    })
  }, [productId])


  if (ratingsInfo === null) {
    return <CircularProgress />
  }

  const displayPrice = () => {
    if (productStyles[styleIndex]["sale_price"]) {
      console.log('sale!')
      return (
        <Grid container direction="row">
          <Grid item xs={12}>
            <Typography className={classes.salePrice} variant="h6">
              {productStyles[styleIndex]["sale_price"]}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="overline" gutterBottom>
            Original Price: <span className={classes.lineThrough}>{productStyles[styleIndex]["original_price"]}</span>
            </Typography>
          </Grid>
        </Grid>
      )
    } else {
      return (
        <Typography variant="h6" gutterBottom>
          {productStyles[styleIndex]["original_price"]}
        </Typography>
      )
    }
  }



  return (
    <Grid container className={classes.root} direction="column" justifyContent="flex-start" alignItems="stretch">
      <Grid container direction="row" alignItems="center">
        <Rating name="avgProductRating" value={ratingsInfo.avgProductRating}  precision={0.25} readOnly />
        <Typography variant="caption" className={classes.reviewsLink}>
           Read all {ratingsInfo.totalRatings} reviews
        </Typography>
      </Grid>
      <Typography variant="h6">
        {currentProduct.category}
      </Typography>
      <Typography className={classes.category} variant="h3" gutterBottom>
        {currentProduct.name}
      </Typography>
      {displayPrice()}
      <Grid container alignItems="center" className={classes.temp} justifyContent="center">
        <Typography variant="overline">
          Styles Select Component
        </Typography>
      </Grid>
      <Grid container direction="row" justifyContent="flex-start" spacing={1}>
        <Grid item xs={8}>
          <TextField variant="outlined" defaultValue="Select Size" fullWidth></TextField>
        </Grid>
        <Grid item xs={2}>
          <Select variant="outlined" label="Qty">
            <MenuItem>1</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">Add to Cart</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductDetails;