import React, { useState } from "react";
import "../styles/AdrresForm.css";

function AddressForm({onSuccess }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://mernpickle-backend.onrender.com/address/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          pincode,
          locality,
          address,
          city,
          state,
        }),
        credentials: "include",
      });
      const result = await response.json();
      if(result.success){
        onSuccess();
      }
    } catch (error) {
      console.error("Add Message Error:", error);
    }
  };
  return (
    <div className="formadrrrescon">
      <form onSubmit={handleSubmit}>
        <h3 className="titlenewadrress">Add New Address</h3>
        <div className="firsthalfaddresform">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="fieldaddresbuy"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            name="mobile"
            placeholder="Mobile Number"
            className="fieldaddresbuy "
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        <div className="firsthalfaddresform">
          <input
            type="number"
            name="pincode"
            placeholder="Pincode"
            className="fieldaddresbuy"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <input
            type="text"
            name="locality"
            placeholder="Locality"
            className="fieldaddresbuy"
            onChange={(e) => setLocality(e.target.value)}
          />
        </div>
        <div className="firsthalfaddresform">
          <textarea
            name="address"
            placeholder="Address"
            className="fieldaddresbuy"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="firsthalfaddresform">
          <input
            type="text"
            name="city"
            placeholder="City"
            className="fieldaddresbuy"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            className="fieldaddresbuy"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <button className="saveaddressbtn">Save</button>
      </form>
    </div>
  );
}

export default AddressForm;
