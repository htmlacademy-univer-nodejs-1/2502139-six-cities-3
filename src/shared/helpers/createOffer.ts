import { Offer, OfferFeature, OfferType, UserType } from '../types/index.js';

export const createOffer = (offerData: string): Offer => {
  const [
    name,
    description,
    publicationDate,
    city,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    roomsCount,
    guestsCount,
    price,
    features,
    author,
    commentsCount,
    coordinates,
  ] = offerData.replace('\n', '').split('\t');

  const [userName, userEmail, userAvatar, userPassword, userType] =
    author.split(',');
  const [latitude, longitude] = coordinates.split(' ');

  return {
    name,
    description,
    publicationDate: new Date(publicationDate),
    city,
    previewImage,
    images: images.split(','),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: Number(rating),
    type: type as OfferType,
    roomsCount: Number(roomsCount),
    guestsCount: Number(guestsCount),
    price: Number(price),
    features: features.split(',') as OfferFeature[],
    author: {
      name: userName,
      email: userEmail,
      password: userPassword,
      avatar: userAvatar,
      type: userType as UserType,
    },
    commentsCount: Number(commentsCount),
    coordinates: {
      latitude: Number(latitude),
      longitude: Number(longitude),
    },
  };
};
