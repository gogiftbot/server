import { toFile, wrapper } from "../utils";
import "dotenv/config";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { caseService, CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

wrapper(async ({ context }) => {
  const newCase = {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    title: "Sweet Surprise",
    price: 1.5,
    gifts: [
      // {
      //   id: "210eca60-d829-48dd-a22f-89739f579ec8",
      //   title: "TON",
      //   price: 0.5,
      // },
      // {
      //   id: "210eca60-d829-48dd-a22f-89739f579ec8",
      //   title: "TON",
      //   price: 0.8,
      // },
      // {
      //   id: "210eca60-d829-48dd-a22f-89739f579ec8",
      //   title: "TON",
      //   price: 1,
      // },
      {
        id: "210eca60-d829-48dd-a22f-89739f579ec8",
        title: "Сupid Сharm",
        price: 14.5,
      },
      {
        id: "210eca60-d829-48dd-a22f-89739f579ec8",
        title: "Joyful Bundle",
        price: 2.97,
      },
      {
        id: "l8m9n0o1-p2q3-ef12-3456-789012345678",
        title: "Lol Pop",
        price: 1.39,
      },
      {
        id: "b8c9d0e1-f2g3-4567-89ab-cdef12345678",
        title: "Desk Calendar",
        price: 1.27,
      },
      {
        id: "h4i5j6k7-l8m9-abcd-ef12-345678901234",
        title: "Ginger Cookie",
        price: 1.99,
      },
      {
        id: "c70e4ceb-002a-464c-b513-d3410d105035",
        title: "Witch Hat",
        price: 2.58,
      },
      {
        id: "06c8b1dd-359c-47a6-b995-7b0f65e63799",
        title: "Light Sword",
        price: 3.4,
      },
      {
        id: "a3b4c5d6-e7f8-4567-8901-234567890123",
        title: "Swiss Watch",
        price: 37,
      },
      {
        id: "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
        title: "Berry Box",
        price: 4.2,
      },
      {
        id: "u7v8w9x0-y1z2-8901-2345-678901234567",
        title: "Record Player",
        price: 9.33,
      },
      {
        id: "a7b8c9d0-e1f2-3456-789a-bcdef1234567",
        title: "Crystal Ball",
        price: 6.76,
      },
      {
        id: "a2994033-ed47-4ec2-a37a-2df5ed83fabf",
        title: "Hanging Star",
        price: 4.89,
      },
      {
        id: "b4c5d6e7-f8g9-5678-9012-345678901234",
        title: "Top Hat",
        price: 9.99,
      },
      {
        id: "c500a1ff-6c8e-4e4f-8eac-6ea36c678df7",
        title: "Restless Jar",
        price: 2.69,
      },
      {
        id: "e5f6a7b8-c9d0-1234-5678-90abcdef1234",
        title: "Candy Cane",
        price: 1.56,
      },
      {
        id: "ed365cdb-7caa-436b-b50a-1598d831fa77",
        title: "Bow Tie",
        price: 3.48,
      },
      {
        id: "210eca60-d829-48dd-a22f-89739f579ec8",
        title: "Valentine Box",
        price: 4.6,
      },
    ],
  };
});
