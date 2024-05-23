import { City, Offer, OfferGood, OfferType, UserType } from '../types/index.js';

export const createOffer = (offerData: string): Offer => {
  const [
    title,
    description,
    publicationDate,
    city,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    bedrooms,
    maxAdults,
    price,
    goods,
    author,
    commentsCount,
    location,
  ] = offerData.replace('\n', '').split('\t');

  const [userName, userEmail, userAvatar, userPassword, userType] =
    author.split(',');
  const [latitude, longitude] = location.split(' ');

  return {
    title,
    description,
    publicationDate: new Date(publicationDate),
    city: city as City,
    previewImage,
    images: images.split(','),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: Number(rating),
    type: type as OfferType,
    bedrooms: Number(bedrooms),
    maxAdults: Number(maxAdults),
    price: Number(price),
    goods: goods.split(',').filter((i) => i) as OfferGood[],
    host: {
      name: userName,
      email: userEmail,
      password: userPassword,
      avatar: userAvatar,
      type: userType as UserType,
    },
    commentsCount: Number(commentsCount),
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
};
