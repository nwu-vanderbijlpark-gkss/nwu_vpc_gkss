

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Comment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "topic_id" "uuid" DEFAULT "gen_random_uuid"(),
    "author_id" character varying,
    "content" "text"
);


ALTER TABLE "public"."Comment" OWNER TO "postgres";


COMMENT ON TABLE "public"."Comment" IS 'A comment in the forum topic';



CREATE TABLE IF NOT EXISTS "public"."Events" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "topic" character varying,
    "description" character varying,
    "date" timestamp without time zone,
    "public" boolean DEFAULT true,
    "venue" character varying DEFAULT 'Unspecified'::character varying,
    "poster" character varying,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "external" boolean DEFAULT false,
    "external_link" "text",
    "needs_groups" boolean DEFAULT false
);


ALTER TABLE "public"."Events" OWNER TO "postgres";


COMMENT ON TABLE "public"."Events" IS 'Table for the events, maintained by any member of the executive commitee';



COMMENT ON COLUMN "public"."Events"."public" IS 'A boolean to determine if the event should be seen by anyone even unauthorized users';



COMMENT ON COLUMN "public"."Events"."venue" IS 'The venue at which the event will be held';



COMMENT ON COLUMN "public"."Events"."external" IS 'If the event is external or not';



COMMENT ON COLUMN "public"."Events"."external_link" IS 'if the event is external, then there should be a link for registration';



COMMENT ON COLUMN "public"."Events"."needs_groups" IS 'if the event needs the members to be in groups';



CREATE TABLE IF NOT EXISTS "public"."Ideas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" character varying,
    "title" "text",
    "description" "text",
    "technologies" "text",
    "domain" "text"
);


ALTER TABLE "public"."Ideas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Member" (
    "id" character varying NOT NULL,
    "username" character varying,
    "image" character varying DEFAULT 'files/images/avatar.png'::character varying,
    "gender" character varying DEFAULT 'Female'::character varying,
    "qualification" character varying,
    "year_of_study" character varying,
    "date_of_birth" character varying,
    "name" character varying,
    "surname" character varying,
    "interests" "text",
    "points" numeric DEFAULT 10,
    "email" "text",
    "linkedin" character varying,
    "github" character varying,
    "portfolio" character varying
);


ALTER TABLE "public"."Member" OWNER TO "postgres";


COMMENT ON TABLE "public"."Member" IS 'The logged in members';



COMMENT ON COLUMN "public"."Member"."linkedin" IS 'Linked Url';



COMMENT ON COLUMN "public"."Member"."github" IS 'github url';



COMMENT ON COLUMN "public"."Member"."portfolio" IS 'portfolio url';



CREATE TABLE IF NOT EXISTS "public"."Member_invitation" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" character varying,
    "email" character varying
);


ALTER TABLE "public"."Member_invitation" OWNER TO "postgres";


COMMENT ON TABLE "public"."Member_invitation" IS 'When another member invites another member to create an account via email';



CREATE TABLE IF NOT EXISTS "public"."Opportunity" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "type" "text",
    "content" "text",
    "user_id" character varying,
    "deadline" "date",
    "organization" "text"
);


ALTER TABLE "public"."Opportunity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Project" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying,
    "link" character varying,
    "description" "text",
    "user_id" character varying,
    "type" character varying DEFAULT 'Tool'::character varying
);


ALTER TABLE "public"."Project" OWNER TO "postgres";


COMMENT ON COLUMN "public"."Project"."type" IS 'Tool or Project';



CREATE TABLE IF NOT EXISTS "public"."Project_rating" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" character varying,
    "project_id" "uuid" DEFAULT "gen_random_uuid"(),
    "rating" smallint
);


ALTER TABLE "public"."Project_rating" OWNER TO "postgres";


COMMENT ON TABLE "public"."Project_rating" IS 'Project ratings';



CREATE TABLE IF NOT EXISTS "public"."Quiz" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "creator_id" character varying,
    "due" timestamp without time zone,
    "time_limit" character varying
);


ALTER TABLE "public"."Quiz" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Team" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying,
    "surname" character varying,
    "role" character varying,
    "email" character varying,
    "image" character varying
);


ALTER TABLE "public"."Team" OWNER TO "postgres";


COMMENT ON TABLE "public"."Team" IS 'A table for the team members, in the admin page of the gkss, which the chairperson will have access to';



ALTER TABLE "public"."Team" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Team_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Topic" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "author_id" character varying,
    "topic" character varying,
    "content" "text",
    "tags" "text"
);


ALTER TABLE "public"."Topic" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."app_usage" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "location" character varying,
    "visitor" character varying
);


ALTER TABLE "public"."app_usage" OWNER TO "postgres";


COMMENT ON TABLE "public"."app_usage" IS 'Track and log the users'' usage of our app to know which features are mostly used';



ALTER TABLE "public"."app_usage" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."app_usage_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."event_attendee" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "event_id" "uuid" DEFAULT "gen_random_uuid"(),
    "user_id" character varying,
    "status" character varying
);


ALTER TABLE "public"."event_attendee" OWNER TO "postgres";


COMMENT ON TABLE "public"."event_attendee" IS 'Statu should be registered, attending or missed';



CREATE TABLE IF NOT EXISTS "public"."event_group" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "event_id" "uuid" DEFAULT "gen_random_uuid"(),
    "is_public" boolean DEFAULT true,
    "user_id" character varying
);


ALTER TABLE "public"."event_group" OWNER TO "postgres";


COMMENT ON TABLE "public"."event_group" IS 'If the event needs groups';



COMMENT ON COLUMN "public"."event_group"."user_id" IS 'The user who created this group';



CREATE TABLE IF NOT EXISTS "public"."event_group_member" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" character varying,
    "event_group_id" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."event_group_member" OWNER TO "postgres";


COMMENT ON TABLE "public"."event_group_member" IS 'Group member of an event group';



CREATE TABLE IF NOT EXISTS "public"."project_views" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "project_id" "uuid" DEFAULT "gen_random_uuid"(),
    "ip_address" "text"
);


ALTER TABLE "public"."project_views" OWNER TO "postgres";


ALTER TABLE "public"."project_views" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."project_views_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."quiz_attempt" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" character varying,
    "quiz_id" "uuid" DEFAULT "gen_random_uuid"(),
    "points" bigint
);


ALTER TABLE "public"."quiz_attempt" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quiz_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" character varying,
    "text" "text",
    "correctOption" character varying,
    "correctAnswer" character varying,
    "points" bigint,
    "quiz_id" "uuid" DEFAULT "gen_random_uuid"(),
    "options" "text"[],
    "image" "text" DEFAULT 'none'::"text"
);


ALTER TABLE "public"."quiz_questions" OWNER TO "postgres";


COMMENT ON COLUMN "public"."quiz_questions"."options" IS 'options';



CREATE TABLE IF NOT EXISTS "public"."topic_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "topic_id" "uuid" DEFAULT "gen_random_uuid"(),
    "image" "text"
);


ALTER TABLE "public"."topic_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."topic_views" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "topic_id" "uuid" DEFAULT "gen_random_uuid"(),
    "ip_address" character varying
);


ALTER TABLE "public"."topic_views" OWNER TO "postgres";


COMMENT ON TABLE "public"."topic_views" IS 'A view by a user on a topic';



ALTER TABLE ONLY "public"."Events"
    ADD CONSTRAINT "Events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Events"
    ADD CONSTRAINT "Events_uuid_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Topic"
    ADD CONSTRAINT "Forum_topic_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Ideas"
    ADD CONSTRAINT "Ideas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Member_invitation"
    ADD CONSTRAINT "Member_invitation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Member"
    ADD CONSTRAINT "Member_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."Opportunity"
    ADD CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Project_rating"
    ADD CONSTRAINT "Project_rating_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."topic_views"
    ADD CONSTRAINT "Topic_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."app_usage"
    ADD CONSTRAINT "app_usage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_attendee"
    ADD CONSTRAINT "event_attendee_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_group_member"
    ADD CONSTRAINT "event_group_member_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_group"
    ADD CONSTRAINT "event_group_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Comment"
    ADD CONSTRAINT "post_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_views"
    ADD CONSTRAINT "project_views_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quiz_attempt"
    ADD CONSTRAINT "quiz_attempt_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quiz_questions"
    ADD CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."topic_images"
    ADD CONSTRAINT "topic_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Topic"
    ADD CONSTRAINT "Forum_topic_author_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Ideas"
    ADD CONSTRAINT "Ideas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Member_invitation"
    ADD CONSTRAINT "Member_invitation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Opportunity"
    ADD CONSTRAINT "Opportunity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Member"("id");



ALTER TABLE ONLY "public"."Project_rating"
    ADD CONSTRAINT "Project_rating_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Project_rating"
    ADD CONSTRAINT "Project_rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Project"
    ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Quiz"
    ADD CONSTRAINT "Quiz_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."topic_views"
    ADD CONSTRAINT "Topic_likes_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."Topic"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_attendee"
    ADD CONSTRAINT "event_attendee_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_attendee"
    ADD CONSTRAINT "event_attendee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_group"
    ADD CONSTRAINT "event_group_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_group_member"
    ADD CONSTRAINT "event_group_member_event_group_id_fkey" FOREIGN KEY ("event_group_id") REFERENCES "public"."event_group"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_group_member"
    ADD CONSTRAINT "event_group_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_group"
    ADD CONSTRAINT "event_group_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Comment"
    ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Comment"
    ADD CONSTRAINT "post_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."Topic"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_views"
    ADD CONSTRAINT "project_views_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_attempt"
    ADD CONSTRAINT "quiz_attempt_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."Quiz"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_attempt"
    ADD CONSTRAINT "quiz_attempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Member"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_questions"
    ADD CONSTRAINT "quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."Quiz"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."topic_images"
    ADD CONSTRAINT "topic_images_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."Topic"("id") ON UPDATE CASCADE ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Opportunity";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Project_rating";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."app_usage";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."topic_views";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."Comment" TO "anon";
GRANT ALL ON TABLE "public"."Comment" TO "authenticated";
GRANT ALL ON TABLE "public"."Comment" TO "service_role";



GRANT ALL ON TABLE "public"."Events" TO "anon";
GRANT ALL ON TABLE "public"."Events" TO "authenticated";
GRANT ALL ON TABLE "public"."Events" TO "service_role";



GRANT ALL ON TABLE "public"."Ideas" TO "anon";
GRANT ALL ON TABLE "public"."Ideas" TO "authenticated";
GRANT ALL ON TABLE "public"."Ideas" TO "service_role";



GRANT ALL ON TABLE "public"."Member" TO "anon";
GRANT ALL ON TABLE "public"."Member" TO "authenticated";
GRANT ALL ON TABLE "public"."Member" TO "service_role";



GRANT ALL ON TABLE "public"."Member_invitation" TO "anon";
GRANT ALL ON TABLE "public"."Member_invitation" TO "authenticated";
GRANT ALL ON TABLE "public"."Member_invitation" TO "service_role";



GRANT ALL ON TABLE "public"."Opportunity" TO "anon";
GRANT ALL ON TABLE "public"."Opportunity" TO "authenticated";
GRANT ALL ON TABLE "public"."Opportunity" TO "service_role";



GRANT ALL ON TABLE "public"."Project" TO "anon";
GRANT ALL ON TABLE "public"."Project" TO "authenticated";
GRANT ALL ON TABLE "public"."Project" TO "service_role";



GRANT ALL ON TABLE "public"."Project_rating" TO "anon";
GRANT ALL ON TABLE "public"."Project_rating" TO "authenticated";
GRANT ALL ON TABLE "public"."Project_rating" TO "service_role";



GRANT ALL ON TABLE "public"."Quiz" TO "anon";
GRANT ALL ON TABLE "public"."Quiz" TO "authenticated";
GRANT ALL ON TABLE "public"."Quiz" TO "service_role";



GRANT ALL ON TABLE "public"."Team" TO "anon";
GRANT ALL ON TABLE "public"."Team" TO "authenticated";
GRANT ALL ON TABLE "public"."Team" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Team_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Team_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Team_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Topic" TO "anon";
GRANT ALL ON TABLE "public"."Topic" TO "authenticated";
GRANT ALL ON TABLE "public"."Topic" TO "service_role";



GRANT ALL ON TABLE "public"."app_usage" TO "anon";
GRANT ALL ON TABLE "public"."app_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."app_usage" TO "service_role";



GRANT ALL ON SEQUENCE "public"."app_usage_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."app_usage_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."app_usage_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."event_attendee" TO "anon";
GRANT ALL ON TABLE "public"."event_attendee" TO "authenticated";
GRANT ALL ON TABLE "public"."event_attendee" TO "service_role";



GRANT ALL ON TABLE "public"."event_group" TO "anon";
GRANT ALL ON TABLE "public"."event_group" TO "authenticated";
GRANT ALL ON TABLE "public"."event_group" TO "service_role";



GRANT ALL ON TABLE "public"."event_group_member" TO "anon";
GRANT ALL ON TABLE "public"."event_group_member" TO "authenticated";
GRANT ALL ON TABLE "public"."event_group_member" TO "service_role";



GRANT ALL ON TABLE "public"."project_views" TO "anon";
GRANT ALL ON TABLE "public"."project_views" TO "authenticated";
GRANT ALL ON TABLE "public"."project_views" TO "service_role";



GRANT ALL ON SEQUENCE "public"."project_views_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project_views_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project_views_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."quiz_attempt" TO "anon";
GRANT ALL ON TABLE "public"."quiz_attempt" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_attempt" TO "service_role";



GRANT ALL ON TABLE "public"."quiz_questions" TO "anon";
GRANT ALL ON TABLE "public"."quiz_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_questions" TO "service_role";



GRANT ALL ON TABLE "public"."topic_images" TO "anon";
GRANT ALL ON TABLE "public"."topic_images" TO "authenticated";
GRANT ALL ON TABLE "public"."topic_images" TO "service_role";



GRANT ALL ON TABLE "public"."topic_views" TO "anon";
GRANT ALL ON TABLE "public"."topic_views" TO "authenticated";
GRANT ALL ON TABLE "public"."topic_views" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
