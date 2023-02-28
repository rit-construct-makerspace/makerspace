import * as CalenderEventsRepository from "../repositories/CalendarEvents/CalendarEventsRepository";
import { ApolloContext, CurrentUser } from "../context";
import { Privilege } from "../schemas/usersSchema";

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
