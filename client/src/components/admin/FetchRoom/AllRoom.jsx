import { Button, Chip } from "@mui/material";
import { Box } from "@mui/system";

const AllRoom = (props) => {
  const { rooms, details } = props;
  const handleClick = async (rid) => {
    details(rid);
  };
  return (
    <>
      <Box sx={{ m: 2 }}>
        {rooms.personCount === 0 && (
          <>
            <Button>
              <Chip
                color="success"
                label={rooms.number}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(rooms._id);
                }}
              />
            </Button>
          </>
        )}
        {rooms.personCount === 1 && rooms.type === "Double" && (
          <>
            <Button>
              {" "}
              <Chip
                color="warning"
                label={rooms.number}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(rooms._id);
                }}
              />
            </Button>
          </>
        )}
        {rooms.personCount === 1 && rooms.type === "Single" && (
          <>
            <Button>
              {" "}
              <Chip
                color="secondary"
                label={rooms.number}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(rooms._id);
                }}
              />
            </Button>
          </>
        )}
        {rooms.personCount === 2 && (
          <>
            <Button>
              {" "}
              <Chip
                color="error"
                label={rooms.number}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(rooms._id);
                }}
              />
            </Button>
          </>
        )}
      </Box>
    </>
  );
};

export default AllRoom;
