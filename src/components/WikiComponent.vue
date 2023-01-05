<template>
    <div>
        <v-btn color="primary" @click="saveArticles">Save to Database</v-btn>

        <ul>
            <li v-for="a, i in articleHolder.articles" :key="i + a.id">
                <WikiArticle :article="a"
                             :article-items="articleItems"
                             :categories="categories"
                             :clear-article="clearArticle"
                             :level="1"
                             @deleteArticleEmit="deleteArticle($event)"></WikiArticle>
            </li>
        </ul>

        <br />

        <v-btn color="primary" @click="addArticle">Add Article</v-btn>

        <v-snackbar v-model="snackbar.show">
            {{ snackbar.text }}

            <template v-slot:action="{ attrs }">
                <v-btn color="pink"
                       text
                       v-bind="attrs"
                       @click="snackbar.show = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
    import WikiArticle from './WikiArticle.vue'
    import { collection, doc, setDoc, getDocs, query } from 'firebase/firestore';
    import { db } from '@/stores/db'
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'WikiComponent',
        components: {
            WikiArticle
        },
        created() {
            if (!this.$signedIn)
                this.$router.push({ name: 'Home' })
            else
                this.getArticles()
        },
        computed: {
            articleItems() {
                let articles = []
                this.articleHolder.articles.forEach(a => {
                    articles = articles.concat(this.getArticlesRecursive(a))
                })
                return articles
            },
            categories() {
                let categories = []
                this.articleHolder.articles.forEach(a => {
                    categories = categories.concat(this.getCategoriesRecursive(a))
                })
                return categories
            }
        },
        data() {
            return {
                articleHolder: {
                    articles: []
                },
                clearArticle: {
                    id: '',
                    categories: [],
                    title: '',
                    subtitle: '',
                    body: '',
                    articles: [],
                    references: [/*{ id: '', type: '' }*/]
                }
            }
        },
        methods: {
            addArticle() {
                let article = JSON.parse(JSON.stringify(this.clearArticle))
                article.id = uuidv4()
                this.articleHolder.articles.push(article)
            },
            deleteArticle(article) {
                this.articleHolder.articles = this.articleHolder.articles.filter(x => { return x.id != article.id })
            },
            async getArticles() {
                this.articles = []

                const q = query(collection(db, 'articles'))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                    this.articleHolder = doc.data()
                })
            },
            getArticlesRecursive(article) {
                let articles = [{ id: article.id, title: article.title }]

                article.articles.forEach(a => {
                    articles = articles.concat(this.getArticlesRecursive(a))
                })

                return articles
            },
            getCategoriesRecursive(article) {
                let categories = article.categories

                article.articles.forEach(a => {
                    categories = categories.concat(this.getCategoriesRecursive(a))
                })

                return categories
            },
            async saveArticles() {
                await setDoc(doc(db, 'articles', '1'), this.articleHolder)

                this.snackbar = {
                    show: true,
                    text: 'Articles Saved'
                }
            }
        }
    }
</script>