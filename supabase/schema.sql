-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  subject text,
  body text,
  author_id character varying,
  CONSTRAINT announcements_pkey PRIMARY KEY (id),
  CONSTRAINT announcements_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.member(id)
);
CREATE TABLE public.app_usage (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  location character varying,
  visitor character varying,
  CONSTRAINT app_usage_pkey PRIMARY KEY (id)
);
CREATE TABLE public.applications (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  member_id character varying,
  role character varying,
  status character varying DEFAULT 'submitted'::character varying,
  message text,
  interview_timestamp timestamp with time zone,
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT leader_application_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.member(id)
);
CREATE TABLE public.comment (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  topic_id uuid DEFAULT gen_random_uuid(),
  author_id character varying,
  content text,
  CONSTRAINT comment_pkey PRIMARY KEY (id),
  CONSTRAINT post_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id),
  CONSTRAINT post_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.member(id)
);
CREATE TABLE public.event_attendee (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  event_id uuid DEFAULT gen_random_uuid(),
  user_id character varying,
  status character varying,
  CONSTRAINT event_attendee_pkey PRIMARY KEY (id),
  CONSTRAINT event_attendee_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT event_attendee_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id)
);
CREATE TABLE public.event_criteria (
  event_id uuid DEFAULT gen_random_uuid(),
  title character varying,
  description text,
  max_points integer,
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT event_criteria_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_group (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  event_id uuid DEFAULT gen_random_uuid(),
  user_id character varying,
  submission text DEFAULT ''::text,
  CONSTRAINT event_group_pkey PRIMARY KEY (id),
  CONSTRAINT event_group_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id),
  CONSTRAINT event_group_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_judge (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  fullname character varying,
  email character varying,
  code character varying,
  event_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT event_judge_pkey PRIMARY KEY (id),
  CONSTRAINT event_judge_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_participant (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id character varying,
  event_group_id uuid,
  event_id uuid,
  CONSTRAINT event_participant_pkey PRIMARY KEY (id),
  CONSTRAINT event_group_member_event_group_id_fkey FOREIGN KEY (event_group_id) REFERENCES public.event_group(id),
  CONSTRAINT event_group_member_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id),
  CONSTRAINT event_participant_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  group_id uuid DEFAULT gen_random_uuid(),
  points integer,
  event_id uuid DEFAULT gen_random_uuid(),
  criteria_id uuid,
  judge_id uuid,
  CONSTRAINT event_results_pkey PRIMARY KEY (id),
  CONSTRAINT event_results_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT event_results_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.event_group(id),
  CONSTRAINT event_results_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES public.event_criteria(id)
);
CREATE TABLE public.events (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  topic character varying,
  description text,
  date timestamp without time zone,
  venue character varying DEFAULT 'Unspecified'::character varying,
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  has_groups boolean DEFAULT false,
  slug character varying UNIQUE,
  max_group_members smallint DEFAULT '0'::smallint,
  public boolean DEFAULT true,
  resources text DEFAULT '<p>Tools that might be useful in the event</p>'::text,
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ideas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id character varying,
  title text,
  description text,
  technologies text,
  domain text,
  CONSTRAINT ideas_pkey PRIMARY KEY (id),
  CONSTRAINT Ideas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id)
);
CREATE TABLE public.join_request (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id character varying,
  group_id uuid DEFAULT gen_random_uuid(),
  state character varying DEFAULT 'pending'::character varying,
  CONSTRAINT join_request_pkey PRIMARY KEY (id),
  CONSTRAINT join_request_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id),
  CONSTRAINT join_request_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.event_group(id)
);
CREATE TABLE public.meeting_tool (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  tool character varying,
  meeting_id uuid DEFAULT gen_random_uuid(),
  content text,
  user_id character varying,
  CONSTRAINT meeting_tool_pkey PRIMARY KEY (id),
  CONSTRAINT meeting_tool_meeting_id_fkey FOREIGN KEY (meeting_id) REFERENCES public.meetings(id),
  CONSTRAINT meeting_tool_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id)
);
CREATE TABLE public.meetings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying,
  date timestamp without time zone,
  description text DEFAULT 'No description was added for this meeting'::text,
  creator_id character varying,
  CONSTRAINT meetings_pkey PRIMARY KEY (id),
  CONSTRAINT meetings_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.member(id)
);
CREATE TABLE public.member (
  id character varying NOT NULL,
  username character varying UNIQUE,
  image character varying DEFAULT 'files/images/avatar.png'::character varying,
  gender character varying DEFAULT 'Female'::character varying,
  qualification character varying,
  year_of_study character varying,
  date_of_birth character varying,
  name character varying,
  surname character varying,
  interests text,
  points numeric DEFAULT 10,
  email text,
  linkedin character varying,
  github character varying,
  portfolio character varying,
  CONSTRAINT member_pkey PRIMARY KEY (id)
);
CREATE TABLE public.opportunity (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  type text,
  content text,
  user_id character varying,
  deadline date,
  organization text,
  CONSTRAINT opportunity_pkey PRIMARY KEY (id),
  CONSTRAINT Opportunity_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id)
);
CREATE TABLE public.quiz (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  creator_id character varying,
  due timestamp without time zone,
  time_limit character varying,
  slug character varying UNIQUE,
  CONSTRAINT quiz_pkey PRIMARY KEY (id),
  CONSTRAINT Quiz_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.member(id)
);
CREATE TABLE public.quiz_attempt (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id character varying,
  quiz_id uuid DEFAULT gen_random_uuid(),
  points bigint,
  CONSTRAINT quiz_attempt_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_attempt_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id),
  CONSTRAINT quiz_attempt_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quiz(id)
);
CREATE TABLE public.quiz_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  type character varying,
  text text,
  correctOption character varying,
  correctAnswer character varying,
  points bigint,
  quiz_id uuid DEFAULT gen_random_uuid(),
  options ARRAY,
  image text DEFAULT 'none'::text,
  CONSTRAINT quiz_questions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quiz(id)
);
CREATE TABLE public.team (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  role character varying,
  member_id character varying,
  year character varying DEFAULT '2025'::character varying,
  CONSTRAINT team_pkey PRIMARY KEY (id),
  CONSTRAINT team_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.member(id)
);
CREATE TABLE public.topic (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  author_id character varying,
  topic character varying,
  content text,
  tags text,
  slug character varying UNIQUE,
  CONSTRAINT topic_pkey PRIMARY KEY (id),
  CONSTRAINT Forum_topic_author_fkey FOREIGN KEY (author_id) REFERENCES public.member(id)
);
CREATE TABLE public.topic_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  topic_id uuid DEFAULT gen_random_uuid(),
  image text,
  CONSTRAINT topic_images_pkey PRIMARY KEY (id),
  CONSTRAINT topic_images_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id)
);
CREATE TABLE public.topic_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  topic_id uuid DEFAULT gen_random_uuid(),
  ip_address character varying,
  CONSTRAINT topic_views_pkey PRIMARY KEY (id),
  CONSTRAINT Topic_likes_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id)
);