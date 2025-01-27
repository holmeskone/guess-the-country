import { useEffect, useState } from 'react';

const RandomFlag = () => {
  const [countries, setCountries] = useState([]); // State to store the list of countries
  const [randomCountry, setRandomCountry] = useState(null); // State to store the random country
  const [guess, setGuess] = useState("")
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Fetch the list of country codes and names
        const response = await fetch('https://flagcdn.com/en/codes.json');

        if (!response.ok) {
          throw new Error('Failed to fetch country data');
        }

        const data = await response.json(); // Parse the JSON response
        const countryList = Object.entries(data)
        .map(([code, name], index) => ({
          code,
          name,
          index, // Include the index for filtering
        }))
        .filter((country) => {
          // Exclude countries with indices between 239 and 288
          return !(country.index >= 239 && country.index <= 288);
        })
        .map(({ code, name }) => ({ code, name })); // Remove the index after filtering

        setCountries(countryList); // Update state with the fetched data
        console.log(countryList)

        // Select a random country from the list
        const randomNumber = Math.floor(Math.random() * countryList.length);
        setRandomCountry(countryList[randomNumber]);
      } catch (error) {
        setError(error.message); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCountries(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleRandomize = () => {

    let randomNumber;

    // Select a new random country from the list
    do{
    randomNumber = Math.floor(Math.random() * countries.length);}
    while (randomNumber >= 239 && randomNumber <= 288); // Exclude numbers from 0 to 10
    setRandomCountry(countries[randomNumber]);
  };


  const handleVerification = () => {
    if (randomCountry && guess.trim().toLowerCase() === randomCountry.name.toLowerCase()) {
      console.log("User was right!");
      setCount(prevCount => prevCount + 1);

    } else {
      console.log("User is wrong");
    }
    setTotalCount(prevCount => prevCount + 1);
      // Clear the input field
      
    setGuess("");
    handleRandomize();

  };


  const handleNameChange = (event) =>{
    setGuess(event.target.value)
  }

useEffect(() => {
  const savedBest = localStorage.getItem('bestScore');
  if (savedBest !== null) {
    setBestScore(parseInt(savedBest, 10));
  }
}, []);

useEffect(() => {
    if (count > bestScore) {
      const newBest = count;
      setBestScore(newBest);
      localStorage.setItem('bestScore', newBest.toString());
    }
  }, [count]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Random Country Flag</h1>
        <h2>Current Score: {count}/{totalCount}</h2>
        <h3>Best Score: {bestScore}</h3>
      {randomCountry && (
        <div style={{ marginBottom: '20px' }}>
          <img
            src={`https://flagcdn.com/${randomCountry.code}.svg`}
            width="100"
            alt={randomCountry.name}
            style={{ marginRight: '10px' }}
          />
        </div>
      )}
      {/* <button onClick={handleRandomize}>Randomize</button> */}

      <input type="text" value={guess} onChange={handleNameChange}/>
      <button type='submit' onClick={handleVerification}>Guess!</button>
    </div>
  );
};

export default RandomFlag;