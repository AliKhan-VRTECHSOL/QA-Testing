import { useCallback } from 'react';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const useFavoriteStores = (favoriteStores: string[]) => {
  const getFavoriteStores = useCallback(async () => {
    if (!favoriteStores || favoriteStores.length === 0) return [];

    const requests = favoriteStores.map(placeId => {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
      return fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'OK') return data.result;
          else throw new Error(`Failed for placeId ${placeId}: ${data.status}`);
        })
        .catch(err => {
          console.error(err);
          return null; // Fail gracefully for one place
        });
    });

    const results = await Promise.all(requests);
    return results.filter(Boolean); // remove any nulls
  }, [favoriteStores]);

  return { getFavoriteStores };
};

export default useFavoriteStores;
