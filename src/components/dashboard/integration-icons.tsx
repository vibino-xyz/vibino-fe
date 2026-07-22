import {
  SlackIcon,
  JiraIcon,
  TeamsIcon,
  MeetIcon,
  MailIcon,
} from "@/components/icons";
import type { IntegrationId } from "@/lib/mock-data";

export const INTEGRATION_ICONS: Record<
  IntegrationId,
  (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
> = {
  slack: SlackIcon,
  jira: JiraIcon,
  teams: TeamsIcon,
  meet: MeetIcon,
  email: MailIcon,
};
