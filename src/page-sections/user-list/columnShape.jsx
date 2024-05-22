import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
const columnShape = [{
//   Header: "Avatar",
//   accessor: "avatar",
//   Cell: ({
//     value
//   }) => <AppAvatar src={value} sx={{
//     borderRadius: "20%"
//   }} /> 
// }, {
  Header: "Name",
  accessor: "name"
}, {
  Header: "Email",
  accessor: "email"
}, {
  Header: "Role",
  accessor: "userType"
}, {
  Header: "Status",
  accessor: "is_approved"
}, 
{
  Header: "Edit",
  accessor: "edit",
  Cell: props => {
    return <IconButton>
          <Edit sx={{
        color: "text.disabled",
        fontSize: 18
      }} />
        </IconButton>;
  }
}];
export default columnShape;