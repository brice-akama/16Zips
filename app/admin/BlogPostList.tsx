// app/admin/BlogPostList.tsx;
"use client";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  EditButton,
  DeleteButton,
  SimpleList,
  FunctionField,
  RaRecord,
  Pagination,
} from "react-admin";
import { useMediaQuery, Divider, Box, Typography } from "@mui/material";

// ✅ Type definition to ensure `record` has an `id`
type BlogPostRecord = RaRecord & { title?: string; content?: string; imageUrl?: string };

// Helper function to remove HTML tags and truncate text
const sanitizeAndTruncate = (content: string, maxLength: number = 50): string => {
  const cleanedContent = content.replace(/<\/?[^>]+(>|$)/g, "");
  return cleanedContent.length > maxLength ? cleanedContent.substring(0, maxLength) + "..." : cleanedContent;
};

// ✅ Ensure `record` is properly typed inside FunctionField
const CustomTruncatedTextField = ({ source }: { source: string }) => (
  <FunctionField<BlogPostRecord>
    source={source}
    render={(record) => (record?.[source] ? sanitizeAndTruncate(record[source] as string, 60) : "-")}
  />
);

const BlogPostList: React.FC = (props) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <List {...props} perPage={10} pagination={<Pagination rowsPerPageOptions={[10, 20, 50]} />}>
      {isSmallScreen ? (
        <SimpleList<BlogPostRecord>
          primaryText={(record) => (
            <Typography variant="subtitle1" fontWeight="bold">
              {record?.title ? sanitizeAndTruncate(record.title, 40) : "-"}
            </Typography>
          )}
          secondaryText={(record) => (
            <Box display="flex" gap={1} mt={1}>
              <EditButton record={record} />
              <DeleteButton record={record} />
            </Box>
          )}
        />
      ) : (
        <Datagrid rowClick="edit">
          <TextField label="Title" source="title" />
          <CustomTruncatedTextField source="content" />
          <ImageField source="imageUrl" label="Image" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
      {isSmallScreen && <Divider sx={{ my: 2 }} />}
    </List>
  );
};

export default BlogPostList;