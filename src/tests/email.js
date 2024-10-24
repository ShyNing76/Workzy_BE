const addAmenities = {
    booking_id: "123e4567-e89b-12d3-a456-426614174000",
    addAmenities: [
        {
            amenity_id: "123e4567-e89b-12d3-a456-426614174000",
            quantity: 1,
        },
        {
            amenity_id: "223e4567-e89b-12d3-a456-426614174001",
            quantity: 2,
        },
    ],
    total_amenities_price: 500000,
};

const amenities = [
    {
        amenity_id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Amenity 1",
        price: 100000,
        rent_price: 100000,
    },
    {
        amenity_id: "223e4567-e89b-12d3-a456-426614174001",
        name: "Amenity 2",
        price: 200000,
        rent_price: 100000,
    },
];

const amenitiesMap = addAmenities.addAmenities.reduce((map, amenity) => {
    map[amenity.amenity_id] = amenity.quantity;
    return map;
}, {});

const totalAmenitiesPrice = amenities.reduce((total, amenity) => {
    return total + amenity.rent_price * amenitiesMap[amenity.amenity_id];
}, 0);

console.log(totalAmenitiesPrice);
