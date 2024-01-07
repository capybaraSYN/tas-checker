// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { Accordion, Link, AccordionItem, Card, Input, Button, Spinner, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, CardHeader } from '@nextui-org/react';

  const ExamplePage = () => {
    const [data, setData] = useState([]);
    const [fetchedData, setFetchedData] = useState([]);
    const [policyId, setPolicyId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setisLoading] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const numWalletsWithPolicyNFT = fetchedData.filter(item => item.amount > 0).length;

    const clearData = () => {
      setFetchedData([]);
    };

    const fetchAssets = async (address, cursor = null, totalAmount = 0, failedAttempts = 0) => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://mainnet.gomaestro-api.org/v1/accounts/${address}/assets`,
        params: {
          policy: policyId,
          cursor,
        },
        headers: { 
          'Accept': 'application/json', 
          'api-key': process.env.MAESTRO_KEY
        }
      };
    
      try {
        const response = await axios(config);
        totalAmount += response.data.data.reduce((sum, asset) => sum + asset.amount, 0);
    
        if (response.data.next_cursor) {
          await delay(1000); // Wait for 1 second
          await fetchAssets(address, response.data.next_cursor, totalAmount);
        } else {
          setFetchedData(prevData => [...prevData, { address, amount: totalAmount }]);
        }
      } catch (error) {
        failedAttempts++;
        if (failedAttempts < 3) {
          await delay(1000); // Wait for 1 second
          await fetchAssets(address, cursor, totalAmount, failedAttempts);
        } else {
          setErrorMessage(error.message);
        }
      }
    };
  
    useEffect(() => {
      Papa.parse('/tasholders.csv', {
        download: true,
        header: true,
        complete: function(results) {
          const filteredData = results.data
            .map(({ rank, address, total }) => ({ rank, address, amount: Number(total) }))
            .filter(item => item.amount >= 10)
            .sort((a, b) => b.amount - a.amount);
  
          setData(filteredData);
        }
      });
    }, []);

  
    const handlePolicyIdChange = (event) => {
      setPolicyId(event.target.value);
    };

    const handleSubmit = async () => {
      if (policyId) {
        setisLoading(true);
        for (const item of data) {
          await fetchAssets(item.address);
          await delay(1000); // Wait for 1 second between each request
        }
        setisLoading(false);
      }
    };

let ratio = numWalletsWithPolicyNFT
let message;

if (ratio >= 1 && ratio <= 10) {
  message = "SHIT NUMBERS! You're fucked, sell fast";
} else if (ratio >= 11 && ratio <= 30) {
  message = "MEDIOCRE NUMBERS FOR TAS HOLDERS.. NEED MORE FROM THE TOP 60";
} else if (ratio >= 31 && ratio <= 40) {
  message = "HOLY FUCK IT'S GONNA MOON, 30+ TAS HOLDERS HAS THIS";
} else if (ratio >= 41 && ratio <= 50) {
  message = "THOSE NUMBERS... FOR SURE IT'S GONNA MOON";
} else if (ratio >= 51 && ratio <= 59) {
  message = "APPROVED COLLECTION BY TAS HOLDERS!!!!!!!";
} else if (ratio === 60) {
  message = "Must be some of the hundred TAS Policy Ids, right?";
} else {
  message = "IF THOSE 60 LORDS OF CARDANO DON'T HAVE THE NFT, NO ONE DOES";
}

  
    return (
      <div className="text-gray-800 m-5 rounded-lg">
        <div className="items-center text-center mt">
          <h1 className="text-4xl">CARDANO NFTs INSIDER INFO</h1>
          <h2 className="text-1xl"> COLLECTION WORTH CHECKER</h2>
          <h2 className="text-md text-danger">DISCLAIMER: IT'S JUST FUN, DON'T GET IT TO YOUR HEART</h2>
          <h2 className="text-sm line-through">BUT IF THEY DON'T HAVE, YOU SHOULD NOT TOO, RIGHT?</h2></div>
          <h3 className="text-xl text-center"> fonzies by <a href="https://twitter.com/capybaraNetwrk" target="_blank" className="text-blue-600">@capybaraNetwrk</a></h3>
        <div className="m-10 flex items-center">
        <Input
              key="1"
              type="text"
              label="Enter policy ID"
              labelPlacement="outside"
              description="Please, provide a valid Policy ID"
              value={policyId}
              onChange={handlePolicyIdChange}
            />
            <div className="m-4">
      <Button onClick={handleSubmit}> Check </Button></div>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      <div>
        <Card>
          <div className="self-end text-end items-end">
          <CardHeader >
            <Button onClick={clearData}>Clear Table</Button>
          </CardHeader>
          </div>
        <Table removeWrapper selectionMode="single"  color="primary" className="mx-5 mr-10" >
          <TableHeader>
            <TableColumn>Address</TableColumn>
            <TableColumn>Total Amount</TableColumn>
          </TableHeader>
          <TableBody>
            {fetchedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell><Link isExternal showAnchorIcon href={`https://pool.pm/${item.address}`}>{item.address}</Link></TableCell>
                <TableCell>{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isLoading ? 
        <div className="m-2 ml-5">
          
        {numWalletsWithPolicyNFT}/{fetchedData.length} wallets have this policy NFT 
        </div>
        : null }
        <div className="m-2 ml-5 text-xl">
        {isLoading ? <Spinner size="sm" color="danger"/> : null}  {message}
        </div>
        </Card>
        
        </div>
        <div className="mt-8">
        <Card>
        <Accordion>
          <AccordionItem key="1" aria-label="Accordion 1" title="Top 60 TAS Holders">

        <table className="justify-between">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.rank}</td>
                <Link isExternal showAnchorIcon href={`https://pool.pm/${item.address}`}>{item.address}</Link>
                <td>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </AccordionItem>
        </Accordion>
        </Card>
        </div>
        <div className="text-center bottom-0 mt-5 text-pretty">
        check our private CHAT and talk with us at <a className="text-red-700" href="https://capybara.sh" target="_blank">capybara.sh</a> GET A WHITELIST TOKEN WHILE YOU CAN, ANON
        </div>
     </div>
    );
  };
  
export default ExamplePage;