import * as CalenderEventsRepository from "../repositories/CalendarEvents/CalendarEventsRepository.js";
import { ApolloContext, CurrentUser } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";

const CalendarEventsResolver = {
  Query: {
    calendarEvents: async (
      _: any,
      args: { timeMin: string, maxResults: number },
      { ifAllowed }: ApolloContext) =>
        ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async (_user) => {
          return CalenderEventsRepository.getUpcomingEvents(args.timeMin, args.maxResults);
        })
  }
};

export default CalendarEventsResolver;
