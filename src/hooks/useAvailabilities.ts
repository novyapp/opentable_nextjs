import axios from "axios";
import { useState } from "react";

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<
    { time: string; available: boolean }[] | null
  >(null);

  const fetchAvailabilities = async ({
    slug,
    partySize,
    day,
    time,
  }: {
    slug: string;
    partySize: number;
    day: string;
    time: string;
  }) => {
    console.log(slug, partySize, day, time);
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );

      setLoading(false);
      setData(res.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return {
    loading,
    data,
    error,
    fetchAvailabilities,
  };
}
