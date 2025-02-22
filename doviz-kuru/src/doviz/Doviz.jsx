import React from 'react'
import axios from 'axios'
import {useState} from 'react'
import './Doviz.css'

function Doviz() {
    const [tr, setTr] = useState(null)
    const [usd, setUsd] = useState(null)

    const convert = async () => {
        try {
            const response = await axios.get("https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_VJdzMRbGQASa7TYYvaPSZW5mgFFnqeMXyoNlsAJG")
            // Assuming the API returns rates with USD as base currency
            const trUsd = response.data.data.TRY // Note: Adjusted to correct property path
            const convertedUsd = tr / trUsd
            setUsd(convertedUsd) // This will update the USD input value
        } catch (error) {
            console.error("Conversion error:", error)
        }
    }

    return (
        <div className="root-div">
            <div className="child-div">
                <div>
                    <label>TR : </label>
                    <input
                        onChange={e => setTr(e.currentTarget.value)}
                        type="number"
                        value={tr || ''}
                    />
                </div>
                <div>
                    <label>USD : </label>
                    <input
                        onChange={e => setUsd(e.target.value)}
                        type="number"
                        value={usd || ''}
                    />
                </div>

            </div>
            <button onClick={convert} type="button">Convert</button>
        </div>
    )
}

export default Doviz