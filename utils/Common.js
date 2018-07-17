const calculateRating = (reviews = []) => {

  let total = 0
  for (let index = 0; index < reviews.length; index++) {
    total += reviews[index].rating
  }
  return reviews.length === 0 ? 0 : total / reviews.length
}

export {
  calculateRating
}
