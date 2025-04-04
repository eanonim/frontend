import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { TASK_ATOM } from "engine/state"

const taskList = async (options: Socket["task.list"]["request"]) => {
  const testResponse = {
    daily: {
      title: "Daily",
      description:
        "Complete daily tasks and get $RATING and move up in the rankings",
      interval: "2025-04-05T00:00:00Z",
      tasks: [
        [
          {
            id: 111,
            type: "free_rating_for_ads",
            title: "Show ADS",
            description: "Watch 5 times a day video ads and get $RATING",
            image: "https://api.ratingtma.com/cdn/ads.jpeg",
            required: 5,
            status: "OPEN",
            current: 0,
            action: "ads",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 500,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: -1,
          },
        ],
        [
          {
            id: 15,
            type: "rating_sub_channel",
            title: "Subscribe to the channel",
            description:
              "Subscribe to the channel to stay updated on all the news and bonuses",
            required: 1,
            status: "OPEN",
            current: 0,
            action: "sub",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 1000,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 1,
          },
        ],
        [
          {
            id: 16,
            type: "rating_boost_channel",
            title: "Boost the channel",
            description:
              "Give a boost to the channel so we can publish more exciting content",
            required: 1,
            status: "OPEN",
            current: 0,
            action: "boost",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 500,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 2,
          },
        ],
        [
          {
            id: 17,
            type: "rating_order_buy",
            title: "Buy $RATING",
            description: "Buy rating and climb up the leaderboard.",
            required: 1,
            status: "OPEN",
            current: 0,
            action: "default",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 1000,
                grade: "common",
              },
              {
                key: "ticket",
                type: "numeric",
                count: 5,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 3,
          },
        ],
        [
          {
            id: 19,
            type: "transaction_ton_0.2",
            title: "Support TON",
            description: "Make a 0.2 TON transaction and get a gift from us",
            required: 1,
            status: "OPEN",
            current: 0,
            action: "transaction",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 8000,
                grade: "common",
              },
              {
                key: "ticket",
                type: "numeric",
                count: 10,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 4,
          },
        ],
        [
          {
            id: 50,
            type: "transaction_dogs_1500",
            title: "Support DOGS",
            description: "Make a 1500 DOGS transaction and get a gift from us",
            image: "https://api.ratingtma.com/cdn/dogs.jpeg",
            required: 1,
            status: "OPEN",
            current: 0,
            action: "transaction",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 5000,
                grade: "common",
              },
              {
                key: "ticket",
                type: "numeric",
                count: 10,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 5,
          },
        ],
        [
          {
            id: 51,
            type: "transaction_not_150",
            title: "Support NOT",
            description: "Make a 150 NOT transaction and get a gift from us",
            image: "https://api.ratingtma.com/cdn/not.jpeg",
            required: 1,
            status: "OPEN",
            current: 0,
            action: "transaction",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 7000,
                grade: "common",
              },
              {
                key: "ticket",
                type: "numeric",
                count: 10,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 6,
          },
        ],
        [
          {
            id: 54,
            type: "transaction_cats_35000",
            title: "Support CATS",
            description: "Make a 35000 CATS transaction and get a gift from us",
            image: "https://api.ratingtma.com/cdn/cats.jpeg",
            required: 1,
            status: "OPEN",
            current: 0,
            action: "transaction",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 6000,
                grade: "common",
              },
              {
                key: "ticket",
                type: "numeric",
                count: 10,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 7,
          },
        ],
        [
          {
            id: 20,
            type: "invited_friends",
            title: "Invite friends",
            description: "Invite friends every day and get an extra bonus",
            required: 3,
            status: "OPEN",
            current: 0,
            action: "default",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 1500,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 9,
          },
        ],
        [
          {
            id: 21,
            type: "game_king_buy",
            title: "Become King of the Hill",
            description:
              'Buy a spot in "King of the Hill" and get a nice bonus',
            required: 1,
            status: "OPEN",
            current: 0,
            action: "default",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 2000,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 10,
          },
        ],
        [
          {
            id: 22,
            type: "game_spin_roulette",
            title: "Spin the roulette",
            description:
              "Spin the roulette, win $RATING and climb up the leaderboard",
            required: 1,
            status: "OPEN",
            current: 0,
            action: "default",
            order: 0,
            item: [
              {
                key: "energy",
                type: "numeric",
                count: 1000,
                grade: "common",
              },
              {
                key: "toy",
                type: "number",
                count: 1,
                grade: "common",
              },
            ],
            position: 11,
          },
        ],
      ],
    },
  }

  setter([TASK_ATOM, options.group + options.lang], testResponse)
  return { response: testResponse, error: undefined }

  const { response, error } = await socketSend("task.list", options)

  if (response) {
    setter([TASK_ATOM, options.group + options.lang], response)
  }

  return { response, error }
}

export default taskList
