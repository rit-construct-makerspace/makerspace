import React from "react";
import Page from "../../Page";
import { Avatar, Chip, Divider, Stack, Typography } from "@mui/material";
import LogRow, { LogEventType } from "../../../common/LogRow";
import EquipmentQualificationsCard from "./EquipmentQualificationsCard";

const AdamSavage = {
  name: "Adam Savage",
  avatarHref: "https://speaking.com/wp-content/uploads/2017/06/Adam-Savage.jpg",
  id: "test-id-1",
};

export default function MonitorRoomPage() {
  return (
    <Page title="Workshop">
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        People
      </Typography>

      <Stack direction="row" spacing={1}>
        <Chip
          avatar={<Avatar src={AdamSavage.avatarHref} />}
          label={AdamSavage.name}
          onDelete={() => {}}
        />
        <Chip
          avatar={<Avatar src={AdamSavage.avatarHref} />}
          label={AdamSavage.name}
          onDelete={() => {}}
        />
        <Chip
          avatar={<Avatar src={AdamSavage.avatarHref} />}
          label={AdamSavage.name}
          onDelete={() => {}}
        />
        <Chip
          avatar={<Avatar src={AdamSavage.avatarHref} />}
          label={AdamSavage.name}
          onDelete={() => {}}
        />
        <Chip
          avatar={<Avatar src={AdamSavage.avatarHref} />}
          label={AdamSavage.name}
          onDelete={() => {}}
        />
      </Stack>

      <Typography variant="h5" component="div" sx={{ mb: 2, mt: 6 }}>
        Equipment
      </Typography>

      <Stack direction="row" spacing={2}>
        {/* TODO: remove this hardcoded test data */}
        <EquipmentQualificationsCard
          equipment={{
            id: 123,
            name: "Soldering iron",
            image:
              "https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp",
          }}
          qualifiedPeople={[AdamSavage, AdamSavage, AdamSavage]}
          unqualifiedPeople={[AdamSavage, AdamSavage]}
        />
        <EquipmentQualificationsCard
          equipment={{
            id: 123,
            name: "Soldering iron",
            image:
              "https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp",
          }}
          qualifiedPeople={[AdamSavage, AdamSavage, AdamSavage]}
          unqualifiedPeople={[AdamSavage, AdamSavage]}
        />
        <EquipmentQualificationsCard
          equipment={{
            id: 123,
            name: "Soldering iron",
            image:
              "https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp",
          }}
          qualifiedPeople={[AdamSavage, AdamSavage, AdamSavage]}
          unqualifiedPeople={[AdamSavage, AdamSavage]}
        />
      </Stack>

      <Typography variant="h5" component="div" sx={{ mb: 2, mt: 6 }}>
        History
      </Typography>

      <Stack divider={<Divider flexItem />} spacing={2}>
        <LogRow
          eventType={LogEventType.EXIT_ROOM}
          time="3:23 PM"
          person={AdamSavage}
          description="Exited woodshop"
        />

        <LogRow
          eventType={LogEventType.ENTER_ROOM}
          time="12:45 PM"
          person={{
            name: "Adam Savage",
            avatarHref:
              "https://speaking.com/wp-content/uploads/2017/06/Adam-Savage.jpg",
            id: "test-id-1",
          }}
          description="Entered woodshop"
        />

        <LogRow
          eventType={LogEventType.EXIT_ROOM}
          time="3:23 PM"
          person={AdamSavage}
          description="Exited woodshop"
        />

        <LogRow
          eventType={LogEventType.ENTER_ROOM}
          time="12:45 PM"
          person={AdamSavage}
          description="Entered woodshop"
        />
      </Stack>
    </Page>
  );
}
