import React, { useState, useEffect } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import "./DisplayMedicine.css";

const DisplayMedicine = ({ data }) => {
  const { salt, salt_forms_json } = data;

  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedStrength, setSelectedStrength] = useState(null);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  const [showMoreForms, setShowMoreForms] = useState(false);
  const [showMoreStrengths, setShowMoreStrengths] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (salt_forms_json && selectedForm === null) {
      const firstForm = Object.keys(salt_forms_json)[0];
      setSelectedForm(firstForm);
    }
  }, [salt_forms_json, selectedForm]);

  useEffect(() => {
    if (salt_forms_json && selectedForm) {
      const firstStrength = Object.keys(salt_forms_json[selectedForm])[0];
      setSelectedStrength(firstStrength);
    }
  }, [selectedForm, salt_forms_json]);

  // useEffect(() => {
  //   if (salt_forms_json && selectedForm && selectedStrength) {
  //     const firstPackaging = Object?.keys(
  //       salt_forms_json[selectedForm][selectedStrength]
  //     )[0];
  //     setSelectedPackaging(firstPackaging);
  //   }
  // }, [selectedForm, selectedStrength, salt_forms_json]);

  useEffect(() => {
    if (salt_forms_json && selectedForm && selectedStrength) {
      const selectedFormStrength =
        salt_forms_json[selectedForm]?.[selectedStrength];
      if (selectedFormStrength) {
        const firstPackaging = Object.keys(selectedFormStrength)[0];
        setSelectedPackaging(firstPackaging);
      }
    }
  }, [selectedForm, selectedStrength, salt_forms_json]);

  useEffect(() => {
    if (salt_forms_json) {
      console.log(salt_forms_json);
      const allPrices = extractAllSellingPrices(salt_forms_json);

      const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
      setPrice(minPrice);
    }
  }, [selectedForm, selectedStrength, selectedPackaging, salt_forms_json]);

  const extractAllSellingPrices = (saltFormsJson) => {
    const prices = [];

    for (const form in saltFormsJson) {
      for (const strength in saltFormsJson[form]) {
        for (const packaging in saltFormsJson[form][strength]) {
          const pricingData = saltFormsJson[form][strength][packaging];
          console.log(pricingData);
          if (Array.isArray(pricingData)) {
            pricingData.forEach((priceDetail) => {
              if (priceDetail && priceDetail.selling_price) {
                prices.push(priceDetail.selling_price);
              }
            });
          } else if (pricingData && pricingData.selling_price) {
            prices.push(pricingData.selling_price);
          }
        }
      }
    }
    console.log(prices);
    return prices;
  };

  const visibleForms = showMoreForms
    ? Object.keys(salt_forms_json || {})
    : Object.keys(salt_forms_json || {}).slice(0, 4);
  const moreFormsAvailable = Object.keys(salt_forms_json || {}).length > 4;

  const visibleStrengths = showMoreStrengths
    ? Object.keys(salt_forms_json[selectedForm] || {})
    : Object.keys(salt_forms_json[selectedForm] || {}).slice(0, 2);
  const moreStrengthsAvailable =
    Object.keys(salt_forms_json[selectedForm] || {}).length > 2;

  return (
    <div className="main_container">
      <div className="D_container">
        <div className="D_details">
          <div className="box">
            <p className="label">Form:</p>
            <p className="label">Strength:</p>
            <p className="label">Packaging:</p>
          </div>

          <div>
            <div className="forms">
              {visibleForms.map((form) => (
                <button
                  key={form}
                  className={`btn ${form === selectedForm ? "selected" : ""} `}
                  onClick={() => setSelectedForm(form)}
                >
                  {form}
                </button>
              ))}
              {moreFormsAvailable && (
                <button
                  className="more-button"
                  onClick={() => setShowMoreForms(!showMoreForms)}
                >
                  {showMoreForms ? "hide.." : "more.."}
                </button>
              )}
            </div>
            {selectedForm && (
              <div className="strength">
                {visibleStrengths.map((strength) => (
                  <span
                    key={strength}
                    className={strength === selectedStrength ? "selected" : ""}
                    onClick={() => setSelectedStrength(strength)}
                  >
                    {strength}
                  </span>
                ))}
                {moreStrengthsAvailable && (
                  <button
                    className="more-button"
                    onClick={() => setShowMoreStrengths(!showMoreStrengths)}
                  >
                    {showMoreStrengths ? "hide.." : "more.."}
                  </button>
                )}
              </div>
            )}
            {selectedForm && selectedStrength && (
              <div className="packaging">
                {Object.keys(
                  salt_forms_json[selectedForm][selectedStrength] || {}
                ).map((packaging) => (
                  <span
                    key={packaging}
                    className={`${
                      packaging === selectedPackaging ? "selected" : ""
                    } packaging`}
                    onClick={() => setSelectedPackaging(packaging)}
                  >
                    {packaging}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="D_Dynamic_data">
          <p className="salt_name">{salt}</p>
          <p>
            <span>{selectedForm}</span>
            <span>|</span>
            <span>{selectedStrength}</span>
            <span>|</span>
            <span>{selectedPackaging}</span>
          </p>
        </div>
        <div className="D_price D_Dynamic_data">
        
          {price !== 0 ? price : `No stores selling this 
          product near you`}
        </div>
      </div>
    </div>
  );
};

export default DisplayMedicine;
