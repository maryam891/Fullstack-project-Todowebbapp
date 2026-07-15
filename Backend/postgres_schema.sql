--
-- PostgreSQL database dump
--

\restrict xUuwPHGGaGo9tzN7WC2SBZcNR6KasCpVdyQ3uLfGnOfkwtdQ7agBjsGjtuBtyac

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-15 16:26:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16432)
-- Name: todo_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.todo_images (
    id integer NOT NULL,
    image text
);


ALTER TABLE public.todo_images OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16431)
-- Name: todo_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.todo_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todo_images_id_seq OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 221
-- Name: todo_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.todo_images_id_seq OWNED BY public.todo_images.id;


--
-- TOC entry 224 (class 1259 OID 16442)
-- Name: todos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    todos text NOT NULL,
    todo_description text,
    completed_todo boolean DEFAULT false,
    chosen_date text,
    user_id integer,
    image_id integer
);


ALTER TABLE public.todos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16441)
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todos_id_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 223
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    user_img text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4867 (class 2604 OID 16435)
-- Name: todo_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todo_images ALTER COLUMN id SET DEFAULT nextval('public.todo_images_id_seq'::regclass);


--
-- TOC entry 4868 (class 2604 OID 16445)
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- TOC entry 4866 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5030 (class 0 OID 16432)
-- Dependencies: 222
-- Data for Name: todo_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.todo_images (id, image) FROM stdin;
1	basketball.svg
2	gotowork.svg
3	groceryImage.svg
4	groceries.svg
5	interview.svg
6	camping.svg
7	homeWork.svg
8	music.svg
9	soccer.svg
10	travel.svg
11	codeImg.svg
12	cleanupImage.svg
13	meditateImg.svg
14	walkdogImg.svg
15	workoutImage.svg
16	surf.svg
17	coffe.svg
18	halloween.svg
19	cat.svg
20	dog.svg
21	designer.svg
22	onlineShopping.svg
23	prepare.svg
24	project.svg
25	readbook.svg
26	relax.svg
27	select.svg
28	trip.svg
29	workoutImg2.svg
30	MeetingImg.svg
31	barber.svg
32	coffe.svg
33	workout3.svg
34	takePhotos.svg
35	mindmap.svg
36	decorate-christmas-tree.svg
37	birthdayCake.svg
\.


--
-- TOC entry 5032 (class 0 OID 16442)
-- Dependencies: 224
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.todos (id, todos, todo_description, completed_todo, chosen_date, user_id, image_id) FROM stdin;
5	Clean room	\N	f	\N	2	\N
6	Walk with my dog	\N	f	\N	2	\N
7	Work on code problem	at 2pm	f	\N	2	\N
8	Workout	7pm 	f	\N	2	\N
9	Take cat to vet	At 3pm and get prescribed medicine if given by vet.	f	\N	2	\N
10	Take cat to vet	at 3pm and get prescribed medicine if given	f	\N	2	\N
12	travel	at 3pm	f	\N	2	\N
13	go to barber	at 2pm	f	\N	2	\N
14	go to work	at 7pm	f	\N	2	\N
15	play basketball		f	\N	2	\N
16	Buy groceries		f	\N	2	\N
17	go for a surf		f	\N	2	\N
18	Work on code problem		f	\N	2	11
19	Workout		f	\N	2	15
21	Take my dog for a walk	At the park and meet up with my friend	f	\N	2	14
25	Go to work		f	\N	1	2
26	Go get a haircut		f	\N	2	31
29	Go to Alex's birthday party		f	2025-09-06T11:00:00.000Z	1	37
30	do homework		f	2025-09-10T17:43:59.419Z	1	24
31	baskeball practise		f	2026-04-26T14:18:30.278Z	9	1
22	Take cat to the vet	At 1pm	t	\N	1	19
24	Go camping with my friends		f	\N	1	6
3	Have meeting at 8	\N	f	\N	1	30
32	have a meeting		f	2026-07-17T08:30:00.000Z	15	5
4	meditate		f	2026-07-20T21:43:32.000Z	15	13
\.


--
-- TOC entry 5028 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, user_img) FROM stdin;
1	Alice	Alice@gmail.com	$2b$10$hIZuaNPDesL8LP8HWBFEzeQ54z9RwKFtPyGxvz3owcUF2AMpFsqZW	Alice.svg
2	Bob	Bob@gmail.com	$2b$10$BLUyt0rrQHA6zRVxConEAO6ZWH02lRDClSCEdu.jHQ6JUITXfCpi.	Bob.svg
4	Lisa	lisa@gmail.com	$2b$10$Wl5XaBOlvrrneTzJXP.wbOjwWVvq8UGKsuO3KfrZ6OD5GJFq.V7HO	\N
8	testuser4	testuser4@gmail.com	$2b$10$LeZv8uogla.3AWH.xdc3V.MMZSSfHXwqkHiuWjb6naP4YGYCq9sIG	\N
9	testUser6	testUser6@gmail.com	$2b$10$ERmjjRDViWS.Ip1knNdWnegwZDKCEKIHnNLKWxgRZ8tY0roP59BZe	\N
10	user2	user2@gmail.com	$2b$10$KVVPYaEPPL/hRBlueVKGk.Vy4/aqVtwWdb3bPbvlV/CbxegII8CxK	\N
12	m	mary	$2b$10$xOXxPzHWI3WDhRo.3uhUveTDOOyMT3ijlwHoZBweWIBKw70q6Lwhi	\N
13	testuser	testuser@gmail.com	$2b$10$OIDN6kShEArTVK0poHcPJ.0wtscgWqKPVLItzJKZJEav3cvnlEGHG	\N
14	testUser12	testUser12@gmail.com	$2b$10$v09YnAHbVkgR4UhmMrQqze9RmElksPOX6YkrfqlqEe0IaxEZXDM3u	\N
15	testuser22	testuser22@gmail.com	$2b$10$xLUWlEk.WcobwiLQv2O00uS0ohSbjP6GjMSQ/cdUuxfz7LFz9y4bC	\N
\.


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 221
-- Name: todo_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.todo_images_id_seq', 37, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 223
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.todos_id_seq', 33, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- TOC entry 4875 (class 2606 OID 16440)
-- Name: todo_images todo_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todo_images
    ADD CONSTRAINT todo_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4877 (class 2606 OID 16452)
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 16403)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4873 (class 2606 OID 16401)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4878 (class 2606 OID 16458)
-- Name: todos todos_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.todo_images(id);


--
-- TOC entry 4879 (class 2606 OID 16453)
-- Name: todos todos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-07-15 16:26:29

--
-- PostgreSQL database dump complete
--

\unrestrict xUuwPHGGaGo9tzN7WC2SBZcNR6KasCpVdyQ3uLfGnOfkwtdQ7agBjsGjtuBtyac

