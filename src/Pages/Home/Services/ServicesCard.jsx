import React from "react";

const ServicesCard = ({service}) => {
  return (
    <div className="card-body items-center text-center">
      {service.icon}
      <h3 className="card-title mt-4">{service.title}</h3>
      <p className="text-gray-600">{service.description}</p>
    </div>
  );
};

export default ServicesCard;
