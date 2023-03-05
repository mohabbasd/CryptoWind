import { Badge, Box, Button, Container, HStack, Image, Progress, Radio, RadioGroup, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, VStack } from '@chakra-ui/react'
import axios from 'axios';
import { server } from '../index';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Loader from './Loader'
import ErrorComponent from './ErrorComponent';
import Chart from './Chart';


const CoinDetails = () => {
  const params = useParams();
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("cad");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);

  const currencySymbol =
    currency === "cad" ? "CA$ " : currency === "inr" ? "₹ " : currency === 'kwd' ? 'د.ك ' : "$ ";


    const btns = ["24 Hours", "7 Days", "2 Weeks", "1 Month", "2 Months", "6 Months", "1 Year", "5 Years", "Max"];

    const switchChartStats = (key) => {
      switch (key) {
        case "24 Hours":
          setDays("24h");
          setLoading(true);
          break;

        case "7 Days":
          setDays("7d");
          setLoading(true);
          break;

        case "2 Weeks":
          setDays("14d");
          setLoading(true);
          break;

        case "1 Month":
          setDays("30d");
          setLoading(true);
          break;

        case "2 Months":
          setDays("60d");
          setLoading(true);
          break;

        case "6 Months":
          setDays("200d");
          setLoading(true);
          break;
          
        case "1 Year":
          setDays("365d");
          setLoading(true);
          break;

        case "5 Years":
          setDays("1825d");
          setLoading(true);
          break;

        case "Max":
          setDays("max");
          setLoading(true);
          break;
  
        default:
          setDays("24h");
          setLoading(true);
          break;
      }
    };

  useEffect(() => {
    const fetchCoin = async () => {

      try {
        const { data } = await axios.get(
          `${server}/coins/${params.id}`
        );

        const { data: chartData } = await axios.get(
          `${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`
        );
        setCoin(data);
        setChartArray(chartData.prices);
        setLoading(false);

      } catch (error) {
        setError(true);
        setLoading(false);
      }

    }
    fetchCoin();
  }, [params.id, currency, days]);

  if (error) return <ErrorComponent message={'Error while fetching coin'} />;


  return (
    <Container maxW={'container.xl'}>
      {
        loading ? (
          <Loader />
        ) : (
          <>
            <Box width={'full'} borderWidth={1}>
              <Chart arr={chartArray} currency={currencySymbol} days={days}/>
            </Box>
            {/* <HStack p={'4'} wrap='wrap'>
            {
              btns.map((i) => (
                <Button key={i} onClick={() => switchChartStats(i)} >{i}</Button>
              ))
            }
            </HStack> */}

            <HStack p="4" overflowX={"auto"}>
            {btns.map((i) => (
              <Button
                disabled={days === i}
                key={i}
                onClick={() => switchChartStats(i)}
              >
                {i}
              </Button>
            ))}
          </HStack>


            <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
              <HStack spacing={"4"}>
                <Radio value={"cad"}>CAD</Radio>
                <Radio value={"inr"}>INR</Radio>
                <Radio value={"kwd"}>KWD</Radio>
                <Radio value={"usd"}>USD</Radio>
              </HStack>
            </RadioGroup>
            <VStack spacing={'4'} p='16' alignItems={'flex-start'}>
              <Text fontSize={'small'} alignSelf='center' opacity={'0.7'}>
                Last Updated on {" "}
                {Date(coin.market_data.last_updated).split('G')[0]}
              </Text>
              <Image src={coin.image.large} w={16} h={16} objectFit='contain' />
              <Stat>
                <StatLabel>{coin.name}</StatLabel>
                <StatNumber>{currencySymbol}{coin.market_data.current_price[currency]}</StatNumber>
                <StatHelpText>
                  <StatArrow type={
                    coin.market_data.price_change_percentage_24h > 0
                      ? "increase" : "decrease"
                  } />
                  {coin.market_data.price_change_percentage_24h}%
                </StatHelpText>
              </Stat>
              <Badge
                fontSize={'2xl'}
                bgColor='blackAlpha.800'
                color={'white'}
              >
                {`#${coin.market_cap_rank}`}
              </Badge>
              <CustomBar
               high={`${currencySymbol}${coin.market_data.high_24h[currency]}`} 
               low={`${currencySymbol}${coin.market_data.low_24h[currency]}`} 
              />

              <Box w={'full'} p='4'>
              <Item title='Max Supply' value={coin.market_data.max_supply}/>
              <Item title='Circulating Supply' value={coin.market_data.circulating_supply}/>
              <Item title='Market Cap' value={`${currencySymbol}${coin.market_data.market_cap[currency]}`}/>
              <Item title='All time low' value={`${currencySymbol}${coin.market_data.atl[currency]}`}/>
              <Item title='All time high' value={`${currencySymbol}${coin.market_data.ath[currency]}`}/>
              </Box>

            </VStack>
          </>
        )
      }
    </Container>
  );
};

const Item = ({title, value}) => (
  <HStack justifyContent={'space-between'} w='full' my={'4'}>
    <Text fontFamily={'Bebas Neue'} letterSpacing='widest'>
    {title}
    </Text>
    <Text>{value}</Text>
  </HStack>
)

const CustomBar = ({high, low}) => (
   <VStack w={'full'}>
    <Progress value={'50'} colorScheme='teal' w={'full'}/>
    <HStack justifyContent={'space-between'} w='full'>
      <Badge children={low} colorScheme='red'/>
      <Text fontSize={'sm'}>24H range</Text>
      <Badge children={high} colorScheme='green'/>
    </HStack>
   </VStack>
);
export default CoinDetails