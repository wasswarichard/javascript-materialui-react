import { useEffect, useState } from 'react';

const backendUrl = 'https://nestjs-backend-production-a279.up.railway.app';

const useFetch = () => {
   const [data, setData] = useState();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   useEffect(() => {
      setLoading(true);
      fetch(`${backendUrl}/transactions`)
         .then((response) => response.json())
         .then(
            (result) => {
               const payload = result.sort((a, b) => {
                  if (parseInt(a.transactionDate) > parseInt(b.transactionDate)) {
                     return 1;
                  }
                  if (parseInt(a.transactionDate) < parseInt(b.transactionDate)) {
                     return -1;
                  }
                  return 0;
               });
               setData(payload);
            },
            (error) => setError(error)
         )
         .finally(() => {
            setLoading(false);
         });
   }, []);

   return {
      data,
      loading,
      error,
   };
};

export default useFetch;
