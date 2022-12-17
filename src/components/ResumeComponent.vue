<template>
    <div>
        <h1 class="text-center">Bryan Arriaga</h1>
        <h2 class="text-center">bryanoarriaga@gmail.com</h2>
        <h2>Summary</h2>
        <p>
            Driven programmer with over 8 years of experience working in web development. Experience in <b>Visual Studio, C#, .NET, MVC, SQL, Oracle, JavaScript, HTML5, CSS3, and more.</b>
        </p>
        <h3>Technical Skills</h3>
        <v-row v-for="t in technicalSkills" :key="t.name">
            <v-col cols="2">
                <i>{{t.name}}:</i>
            </v-col>
            <v-col cols="10">
                <p>{{t.skills.join(', ')}}</p>
            </v-col>
        </v-row>

        <h3>Professional Experience</h3>
        <template v-for="p in professionalExperiences">
            <!--<hr :key="p.company" />-->
            <v-row :key="p.company">
                <v-col cols="6">
                    <b>{{p.company}}</b>, <i>{{p.title}}</i>
                </v-col>
                <v-col cols="6" class="text-right">
                    <b>{{p.startDate}} - {{p.endDate}}</b>
                </v-col>
                <template v-for="g in p.groups">
                    <v-col cols="12" :key="g.title">
                        <u>{{g.title}}</u>
                        <ul>
                            <li v-for="point in g.points" :key="point">{{point}}</li>
                        </ul>
                    </v-col>
                </template>
            </v-row>
        </template>

        <h3>Education</h3>
        <v-row>
            <v-col cols="6">Bachelor of Science, <i>Game and Simulation Programming</i></v-col>
            <v-col cols="6 text-right">DeVry University</v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'ResumeComponent',
        data() {
            return {
                technicalSkills: [
                    {
                        name: 'Technology/Tools',
                        skills: [
                            'Visual Studio',
                            'C#',
                            '.NET',
                            '.NET CORE 3.1',
                            'ASP.NET',
                            'MVC',
                            'HTML5',
                            'CSS3',
                            'JavaScript',
                            'TypeScript',
                            'Vue 2.X',
                            'AngularJS 1.X',
                            'jQuery',
                            'Bootstrap',
                            'Entity Framework',
                            'REST web services',
                            'API',
                            'TFS',
                            'GIT',
                            'iTextSharp',
                            'Power BI Embedded',
                            'Azure Devops'
                        ]
                    },
                    {
                        name: 'Databases',
                        skills: [
                            'SQL Server',
                            'Oracle',
                            'TSQL',
                            'PL/SQL'
                        ]
                    }
                ],
                professionalExperiences: [
                    {
                        company: 'Sports Business Journal',
                        title: 'Full Stack Web Developer',
                        startDate: 'July 2021',
                        endDate: 'Present',
                        groups: [
                            {
                                title: 'New Application Functionality',
                                points: [
                                    "Worked with Manager to gather requirements.",
                                    "Delivered new features in a timely manner.",
                                    "Learned how to use Salesforce, Sitecore, and TIBCO quickly.",
                                    "Wrote documentation for the project.",
                                    "Created new APIs."
                                ]
                            },
                            {
                                title: 'Application Functionality Redesign',
                                points: [
                                    "Gathered requirements with the other developers and management.",
                                    "Worked to refactor existing code, database, and Tibco flows to conform to the changes."

                                ]
                            }
                        ]
                    },
                    {
                        company: 'Medac, Inc',
                        title: 'Senior Software Engineer',
                        startDate: 'September 2020',
                        endDate: 'July 2021',
                        groups: [
                            {
                                title: 'New Application Creation',
                                points: [
                                    "Worked with Manager and Team Lead to gather requirements.",
                                    "Delivered new features in a timely manner as they were requested.",
                                    "Learned how to use a new Microsoft technology quickly, Power BI Embedded.",
                                    "Wrote documentation for the project.",
                                    "Created.NET Core applications and API"
                                ]
                            },
                            {
                                title: 'Legacy Application Support',
                                points: [
                                    "Helped maintain existing ASP.NET applications, created enhancements and resolved existing production issues."
                                ]
                            }
                        ]
                    },
                    {
                        company: 'Savannah River Site (SRR)',
                        title: 'Software Engineer',
                        startDate: 'April 2018',
                        endDate: 'March 2020',
                        groups: [
                            {
                                title: 'New Application Creation',
                                points: [
                                    "Worked within a team to develop a new application to the customer's requirements.",
                                    "Created MVC Razor views, RESTful web services to accomplish CRUD operations, MVC controllers to handle navigation, and automated pdf report generation.",
                                    "Quickly learned how to implement in -house technologies to access company data and perform operations to the team's standards.",
                                    "Created desktop application to convert existing production data into new database design."
                                ]
                            },
                            {
                                title: 'Legacy Application Support',
                                points: [
                                    "Helped maintain existing applications, created enhancements and resolved existing production issues.",
                                    "Read through existing documentation and code on the assigned project and met with customers to find root cause of error.",
                                    "Used TFS for version control, fixed build errors and added missing files to the repository."
                                ]
                            }
                        ]
                    },
                    {
                        company: 'Savannah River Site (SRNS)',
                        title: 'Software Engineer',
                        startDate: 'May 2014',
                        endDate: 'February 2018',
                        groups: [
                            {
                                title: 'Application Conversion',
                                points: [
                                    "Worked with a team to convert existing applications to web applications which conform to the clients' existing Service Oriented Architecture using AngularJS and .NET web services.",
                                    "Worked with customers to gather requirements and drafted software requirement specifications.",
                                    "Migrated and optimized databases from Microsoft Access to Oracle.",
                                    "Wrote RESTful web services to accomplish CRUD operations using Entity Framework.",
                                    "Created a responsive UI using Bootstrap, AngularJS, and conducted multiple tests to ensure high customer satisfaction.",
                                    "Helped find new libraries and extensions to be used in the project to accelerate and ease developer experience"
                                ]
                            },
                            {
                                title: 'New Application Creation',
                                points: [
                                    "Developed a new application, with requirements from a variety of departments in order to standardize and automate existing processes.",
                                    "Designed and created a Database, Stored Procedures, and Database Links using Oracle.",
                                    "Wrote.NET web services that implemented and validated departments' business logic.",
                                    "Created a responsive UI using Bootstrap, AngularJS, and conducted multiple tests to ensure high customer satisfaction."
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>