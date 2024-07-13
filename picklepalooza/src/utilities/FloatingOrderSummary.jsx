import React from 'react'
import "../styles/FloatingBuyOrderSummary.css";
function FloatingOrderSummary({ totalCost, deliveryCost, orderTotal }) {
  return (
    <div className="floatingcontainer">
        <h3 className="titlefloatbuy">Order Summary</h3>
        <div className="floatitemdeltotal">
          <h3 className="floatingbuytxt">Item Cost:</h3>
          <h3 className="floatingbuytxt">Rs {totalCost.toFixed(2)}</h3>
        </div>
        <div className="floatitemdeltotal">
          <h3 className="floatingbuytxt">Delivery:</h3>
          <h3 className="floatingbuytxt">Rs {deliveryCost.toFixed(2)}</h3>
        </div>
        <div className="lineconfloat"></div>
        <div className="floatitemdeltotal">
          <h3 className="floatingbuytxt">Order Total:</h3>
          <h3 className="floatingbuytxt">Rs {orderTotal.toFixed(2)}</h3>
        </div>
      </div>
  )
}

export default FloatingOrderSummary