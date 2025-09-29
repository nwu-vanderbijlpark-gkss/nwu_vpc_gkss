-- First create base tables that are referenced by others
CREATE TABLE public.member (
  id varchar PRIMARY KEY,
  username varchar UNIQUE,
  image varchar DEFAULT 'files/images/avatar.png',
  gender varchar DEFAULT 'Female',
  qualification varchar,
  year_of_study varchar,
  date_of_birth varchar,
  name varchar,
  surname varchar,
  interests text,
  points numeric DEFAULT 10,
  email text,
  linkedin varchar,
  github varchar,
  portfolio varchar,
  whatsapp varchar
);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  topic varchar,
  description text,
  date timestamp,
  venue varchar DEFAULT 'Unspecified',
  has_groups boolean DEFAULT false,
  slug varchar UNIQUE,
  max_group_members smallint DEFAULT 0,
  public boolean DEFAULT true,
  resources text DEFAULT '<p>Tools that might be useful in the event</p>'
);

CREATE TABLE public.topic (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  author_id varchar REFERENCES public.member(id),
  topic varchar,
  content text,
  tags text,
  slug varchar UNIQUE
);

-- Dependent tables
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  subject text,
  body text,
  author_id varchar REFERENCES public.member(id)
);

CREATE TABLE public.app_usage (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  location varchar,
  visitor varchar
);

CREATE TABLE public.application_period (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp NOT NULL DEFAULT now(),
  open_date date,
  close_date date,
  year varchar
);

CREATE TABLE public.applications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  member_id varchar REFERENCES public.member(id),
  role varchar,
  status varchar DEFAULT 'submitted',
  message text,
  interview_timestamp timestamptz,
  period_id uuid REFERENCES public.application_period(id)
);

CREATE TABLE public.comment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  topic_id uuid REFERENCES public.topic(id),
  author_id varchar REFERENCES public.member(id),
  content text
);

CREATE TABLE public.event_attendee (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_id uuid REFERENCES public.events(id),
  user_id varchar REFERENCES public.member(id),
  status varchar
);

CREATE TABLE public.event_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id),
  title varchar,
  description text,
  max_points integer
);

CREATE TABLE public.event_group (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text,
  event_id uuid REFERENCES public.events(id),
  user_id varchar REFERENCES public.member(id),
  submission text DEFAULT ''
);

CREATE TABLE public.event_judge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  fullname varchar,
  email varchar,
  code varchar,
  event_id uuid REFERENCES public.events(id)
);

CREATE TABLE public.event_participant (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id varchar REFERENCES public.member(id),
  event_group_id uuid REFERENCES public.event_group(id),
  event_id uuid REFERENCES public.events(id)
);

CREATE TABLE public.event_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  group_id uuid REFERENCES public.event_group(id),
  points integer,
  event_id uuid REFERENCES public.events(id),
  criteria_id uuid REFERENCES public.event_criteria(id),
  judge_id uuid
);

CREATE TABLE public.ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id varchar REFERENCES public.member(id),
  title text,
  description text,
  technologies text,
  domain text
);

CREATE TABLE public.join_request (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id varchar REFERENCES public.member(id),
  group_id uuid REFERENCES public.event_group(id),
  state varchar DEFAULT 'pending'
);

CREATE TABLE public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name varchar,
  date timestamp,
  description text DEFAULT 'No description was added for this meeting',
  creator_id varchar REFERENCES public.member(id)
);

CREATE TABLE public.meeting_tool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  tool varchar,
  meeting_id uuid REFERENCES public.meetings(id),
  content text,
  user_id varchar REFERENCES public.member(id)
);

CREATE TABLE public.opportunity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text,
  type text,
  content text,
  user_id varchar REFERENCES public.member(id),
  deadline date,
  organization text
);

CREATE TABLE public.quiz (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text,
  creator_id varchar REFERENCES public.member(id),
  due timestamp,
  time_limit varchar,
  slug varchar UNIQUE
);

CREATE TABLE public.quiz_attempt (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id varchar REFERENCES public.member(id),
  quiz_id uuid REFERENCES public.quiz(id),
  points bigint
);

CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  type varchar,
  text text,
  correctOption varchar,
  correctAnswer varchar,
  points bigint,
  quiz_id uuid REFERENCES public.quiz(id),
  options text[],
  image text DEFAULT 'none'
);

CREATE TABLE public.team (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  role varchar,
  member_id varchar REFERENCES public.member(id),
  year varchar DEFAULT '2025'
);

CREATE TABLE public.topic_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  topic_id uuid REFERENCES public.topic(id),
  image text
);

CREATE TABLE public.topic_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  topic_id uuid REFERENCES public.topic(id),
  ip_address varchar
);
