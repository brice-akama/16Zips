"use client";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  ListProps,
  DeleteButton,
  SimpleList,
  RaRecord,
  FunctionField,
} from "react-admin";
import { useMediaQuery, Box, Typography } from "@mui/material";

const OrderList: React.FC<ListProps> = (props) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <List {...props}>
      {isSmallScreen ? (
        <SimpleList
          primaryText={(record: RaRecord) => (
            <Box>
              {record.billingDetails.firstName} {record.billingDetails.lastName}
              {record.billingDetails.email}   {record.billingDetails.phone}
            </Box>
          )}
          secondaryText={(record: RaRecord) => (
            <Box display="flex" gap={1} mt={1}>
              {record.cartItems.map((item: any, index: number) => (
                <Box key={index} display="flex" alignItems="center">
                  <ImageField
                    source={item.mainImage}
                    label={item.name}
                    sx={{ width: 50 }} // Apply width using sx
                  />
                  <Typography variant="body2">
                    {item.name} - {item.quantity} x ${item.price}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          tertiaryText={(record: RaRecord) => (
            <Box>{record.paymentMethod}</Box>
          )}
        />
      ) : (
        <Datagrid>
          <TextField label="Customer Name" source="billingDetails.firstName" />
          <TextField label="Phone" source="billingDetails.phone" />
          
          

          {/* Use FunctionField to iterate over cartItems and display them */}
          <FunctionField
            label="Cart Items"
            render={(record: RaRecord) => (
              <Box>
                {record.cartItems.map((item: any, index: number) => (
                  <Box key={index} display="flex" gap={2} mb={1}>
                    <ImageField source={item.mainImage} label={item.name} sx={{ width: 50 }} />
                    <Typography variant="body2">
                      {item.name} - {item.quantity} x ${item.price}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          />

          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};

export default OrderList;