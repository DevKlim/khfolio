const projectsData = [
    {
        id: "cognify",
        title: "Cognify: Cognitive Load Sonification & Visualization",
        shortDescription: "Award-winning web app visualizing stress data via synchronized charts and data sonification.",
        longDescription: `
            <p>Co-developed this award-winning web application that focuses on visualizing cognitive load and stress data through innovative methods. Key features include:</p>
            <ul>
                <li>Synchronized charts using <strong>D3.js</strong> to display complex datasets intuitively.</li>
                <li>Implementation of <strong>data sonification</strong> using the Web Audio API, allowing users to perceive data patterns through sound.</li>
                <li>CSV and Apple Health data parsing capabilities for a multi-sensory exploration experience.</li>
                <li>Recognized with the People's Choice Award and ranked among Top 8 Best Projects at the UCSD DSC106 Data Visualization Project Showcase.</li>
            </ul>
        `,
        techStack: ["JavaScript", "D3.js", "Web Audio API", "HTML5", "CSS3"],
        thumbnailUrl: "assets/images/thumbnails/cognify_thumb.jpg", // Placeholder
        mainImageUrl: "assets/images/projects/cognify_main.jpg", // Placeholder
        galleryImages: [
            "assets/images/projects/cognify_gallery1.jpg", // Placeholder
            "assets/images/projects/cognify_gallery2.jpg", // Placeholder
        ],
        githubUrl: "https://github.com/DevKlim/cognitive-waveform",
        liveDemoUrl: "https://devklim.github.io/cognitive-waveform/",
        category: "Data Visualization", // For potential filtering like Steam tags
        releaseDate: "2023" // Example
    },
    {
        id: "sp500-predictor",
        title: "S&P 500 Trend Predictor using News Sentiment",
        shortDescription: "Transformer models predicting S&P 500 direction using sentiment analysis (61.5% accuracy).",
        longDescription: `
            <p>This project involved developing a sophisticated model to predict the directional movement of the S&P 500 index based on news sentiment.</p>
            <ul>
                <li>Trained <strong>Transformer models</strong> (BERT variants) on a corpus of news articles from three different sources spanning 2018-2020.</li>
                <li>Achieved a <strong>61.5% test accuracy</strong> in predicting the daily direction (up/down) of the S&P 500.</li>
                <li>Developed and backtested a quantitative trading strategy based on the model's predictions.</li>
                <li>The strategy yielded a simulated profit of <strong>+10% over a 6-month period</strong> compared to a buy-and-hold baseline.</li>
            </ul>
        `,
        techStack: ["Python", "PyTorch", "Transformers (HuggingFace)", "NLP", "Pandas"],
        thumbnailUrl: "assets/images/thumbnails/sp500_thumb.jpg", // Placeholder
        mainImageUrl: "assets/images/projects/sp500_main.jpg", // Placeholder
        galleryImages: [],
        githubUrl: "https://github.com/DevKlim/AlgoTrading_NewsSentiment_SP500", // Assumed based on GitHub
        liveDemoUrl: null,
        category: "Machine Learning",
        releaseDate: "2022"
    },
    {
        id: "datamaid",
        title: "DataMaid: Interactive Data Analysis GUI",
        shortDescription: "Web GUI for interactive data analysis with Pandas, Polars, SQL backends & code generation.",
        longDescription: `
            <p>DataMaid is a user-friendly web-based Graphical User Interface designed for interactive data analysis and manipulation.</p>
            <ul>
                <li>Supports multiple data processing backends, including <strong>Pandas, Polars, and SQL (via DuckDB)</strong>.</li>
                <li>Facilitates multi-dataset joins and complex data operations through an intuitive interface.</li>
                <li>Features automatic <strong>Python and SQL code generation</strong>, allowing users to learn and replicate analyses.</li>
                <li>Built with a modern web stack including FastAPI for the backend and React for the frontend.</li>
            </ul>
        `,
        techStack: ["Python", "Pandas", "Polars", "SQL (DuckDB)", "FastAPI", "React"],
        thumbnailUrl: "assets/images/thumbnails/datamaid_thumb.jpg", // Placeholder
        mainImageUrl: "assets/images/projects/datamaid_main.jpg", // Placeholder
        galleryImages: [],
        githubUrl: "https://github.com/DevKlim/DataMaid",
        liveDemoUrl: null,
        category: "Web Development",
        releaseDate: "2023"
    },
    {
        id: "mmo-server",
        title: "MMO Private Server Development",
        shortDescription: "Backend development for a game server using Ruby and PostgreSQL.",
        longDescription: `
            <p>Ongoing development and maintenance of a private server for a massively multiplayer online game.</p>
            <ul>
                <li>Core backend logic developed in <strong>Ruby</strong>, managing game state, player interactions, and data.</li>
                <li>Utilizes <strong>PostgreSQL</strong> for robust data persistence, storing user accounts, character information, items, and game world state.</li>
                <li>Involves complex backend development, including networking protocols, concurrency management, and database design.</li>
                <li>Hosted on a <strong>Linux</strong> environment.</li>
            </ul>
        `,
        techStack: ["Ruby", "PostgreSQL", "Linux", "Backend Development", "Networking"],
        thumbnailUrl: "assets/images/thumbnails/mmo_thumb.jpg", // Placeholder
        mainImageUrl: "assets/images/projects/mmo_main.jpg", // Placeholder
        galleryImages: [],
        githubUrl: "https://github.com/DevKlim/MapleStory_PrivateServer", // Assumed based on GitHub
        liveDemoUrl: null,
        category: "Game Development",
        releaseDate: "Ongoing"
    },
    {
        id: "llm-report-agent",
        title: "Agentic AI for Emergency Report Processing",
        shortDescription: "EIDO-based agentic AI using LLMs to process emergency reports and text alerts.",
        longDescription: `
            <p>Developed as part of work at the San Diego Supercomputer Center, this project focuses on an EIDO-based (Emergency Incident Data Object) agentic AI.</p>
            <ul>
                <li>Utilizes Large Language Models (<strong>LLMs like Gemini, OpenRouter models</strong>) to process standardized NENA EIDO JSON emergency reports and unstructured text alerts.</li>
                <li>Features a <strong>Streamlit</strong> dashboard for interaction and visualization, with a backend powered by <strong>FastAPI</strong>.</li>
                <li>The core Python agent leverages <strong>LangChain</strong> for critical tasks: data extraction (key fields), geocoding (using Nominatim), incident correlation, and generating LLM-driven summaries and actionable insights.</li>
                <li>Incorporates <strong>OpenCV</strong> and <strong>Tesseract OCR</strong> pipelines to parse map images, extracting street names and landmarks for automated geocoding, thereby enriching incident location data.</li>
            </ul>
            <p><em>This project is part of my role as an AI Engineer & Student Researcher.</em></p>
        `,
        techStack: ["Python", "LLMs (Gemini, OpenRouter)", "LangChain", "FastAPI", "Streamlit", "OpenCV", "Tesseract OCR"],
        thumbnailUrl: "assets/images/thumbnails/llm_agent_thumb.jpg", // Placeholder
        mainImageUrl: "assets/images/projects/llm_agent_main.jpg", // Placeholder
        galleryImages: [],
        githubUrl: "https://github.com/DevKlim/LLM_Report_Agent", // Placeholder, confirm if public or add general SDSC link
        liveDemoUrl: null,
        category: "AI/ML",
        releaseDate: "2024"
    }
];