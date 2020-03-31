import React, {useState, useEffect} from 'react';
import './App.css';

function ItemDetails({match}) {

    useEffect(() => {
        fetchItem();
        console.log(match);
    },[]);

    const [item, setItems] = useState({});

    const fetchItem = async () => {
        const fetchItem = await fetch(`https://jsonplaceholder.typicode.com/todos/get?id=${
            match.params.id
        }`);
        const item = await fetchItem.json();
        setItems(item);
        console.log(item);
    };


  return (
    <div>
        <h1>{item.id}</h1>
    </div>
  );
}

export default ItemDetails;
