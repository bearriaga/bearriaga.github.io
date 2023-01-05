<template>
    <div>
        <v-text-field label="Title" v-model="inputArticle.title">
            <v-icon color="error" slot="append" @click="deleteDialog = true">mdi-delete</v-icon>
            <!--<v-icon color="primary" slot="prepend" @click="editTitle = !editTitle">mdi-content-save</v-icon>-->
        </v-text-field>
        <!-- Maybe bring this back -->
        <!--<template v-if="!editTitle && level == 1">
            <h1>
                <v-btn color="primary" icon @click="editTitle = !editTitle"><v-icon>mdi-pen</v-icon></v-btn>
                <v-icon color="error" slot="prepend" @click="deleteDialog = true">mdi-delete</v-icon>
                {{inputArticle.title}}
            </h1>
            <h2 v-if="!editTitle && level == 2">
                <v-btn color="primary" icon @click="editTitle = !editTitle"><v-icon>mdi-pen</v-icon></v-btn>
                <v-icon color="error" slot="prepend" @click="deleteDialog = true">mdi-delete</v-icon>
                {{inputArticle.title}}
            </h2>
            <h3 v-if="!editTitle && level == 3">
                <v-btn color="primary" icon @click="editTitle = !editTitle"><v-icon>mdi-pen</v-icon></v-btn>
                <v-icon color="error" slot="prepend" @click="deleteDialog = true">mdi-delete</v-icon>
                {{inputArticle.title}}
            </h3>
            <h4 v-if="!editTitle && level == 4">
                <v-btn color="primary" icon @click="editTitle = !editTitle"><v-icon>mdi-pen</v-icon></v-btn>
                <v-icon color="error" slot="prepend" @click="deleteDialog = true">mdi-delete</v-icon>
                {{inputArticle.title}}
            </h4>
            <h5 v-if="!editTitle && level == 5">
                <v-btn color="primary" icon @click="editTitle = !editTitle"><v-icon>mdi-pen</v-icon></v-btn>
                <v-icon color="error" slot="prepend" @click="deleteDialog = true">mdi-delete</v-icon>
                {{inputArticle.title}}
            </h5>
            <h6 v-if="!editTitle && level > 5">
                <v-btn color="primary" icon @click="editTitle = !editTitle"><v-icon>mdi-pen</v-icon></v-btn>
                <v-icon color="error" slot="prepend" @click="deleteDialog = true">mdi-delete</v-icon>
                {{inputArticle.title}}
            </h6>
        </template>-->

        <v-text-field label="Subtitle" v-model="inputArticle.subtitle">
            <!--<v-icon color="primary" slot="prepend" @click="editSubtitle = !editSubtitle">mdi-content-save</v-icon>-->
        </v-text-field>
        <!-- Maybe bring this back -->
        <!--<template v-if="!editSubtitle && level == 1">
            <h2>
                <v-btn color="primary" icon @click="editSubtitle = !editSubtitle"><v-icon>mdi-pen</v-icon></v-btn>
                {{inputArticle.subtitle}}
            </h2>
            <h3 v-if="!editSubtitle && level == 2">
                <v-btn color="primary" icon @click="editSubtitle = !editSubtitle"><v-icon>mdi-pen</v-icon></v-btn>
                {{inputArticle.subtitle}}
            </h3>
            <h4 v-if="!editSubtitle && level == 3">
                <v-btn color="primary" icon @click="editSubtitle = !editSubtitle"><v-icon>mdi-pen</v-icon></v-btn>
                {{inputArticle.subtitle}}
            </h4>
            <h5 v-if="!editSubtitle && level == 4">
                <v-btn color="primary" icon @click="editSubtitle = !editSubtitle"><v-icon>mdi-pen</v-icon></v-btn>
                {{inputArticle.subtitle}}
            </h5>
            <h6 v-if="!editSubtitle && level == 5">
                <v-btn color="primary" icon @click="editSubtitle = !editSubtitle"><v-icon>mdi-pen</v-icon></v-btn>
                {{inputArticle.subtitle}}
            </h6>
            <span v-if="!editSubtitle && level > 5">
                <v-btn color="primary" icon @click="editSubtitle = !editSubtitle"><v-icon>mdi-pen</v-icon></v-btn>
                {{inputArticle.subtitle}}
            </span>
        </template>-->

        <v-textarea label="Body" auto-grow outlined rows="1" v-model="inputArticle.body"></v-textarea>

        <v-combobox v-model="inputArticle.categories"
                    placeholder="Select from existing categories or enter a new one"
                    :items="categories"
                    label="Categories"
                    multiple></v-combobox>

        <v-autocomplete label="Article References"
                        :items="articleItemsMinusCurrent.map((x) => ({ value: { id: x.id, type: 'article' }, text: x.title }))"
                        multiple
                        v-model="inputArticle.references"></v-autocomplete>

        <v-btn color="primary" @click="addArticle">Add Subarticle</v-btn>

        <ul>
            <li v-for="a, i in inputArticle.articles" :key="i + a.id">
                <WikiArticle :article="a"
                             :article-items="articleItems"
                             :categories="categories"
                             :clear-article="clearArticle"
                             :level="+level + 1"
                             @deleteArticleEmit="deleteArticle($event)"></WikiArticle>
            </li>
        </ul>

        <v-dialog v-model="deleteDialog" width="500">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Delete Article
                </v-card-title>

                <v-card-text>
                    Are you sure you want to delete the <b>{{inputArticle.title}}</b> article?
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="justify-end">
                    <v-btn color="error" @click="deleteArticleEmit">Delete</v-btn>
                    <v-btn color="secondary" @click="deleteDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'WikiArticle',
        props: {
            article: Object,
            articleItems: Array,
            categories: Array,
            clearArticle: Object,
            level: Number
        },
        computed: {
            articleItemsMinusCurrent() {
                return this.articleItems.filter(x => { return x.id != this.article.id })
            }
        },
        data() {
            return {
                deleteDialog: false,                
                inputArticle: this.article
            }
        },
        methods: {
            addArticle() {
                let article = JSON.parse(JSON.stringify(this.clearArticle))
                article.id = uuidv4()
                this.inputArticle.articles.push(article)
            },
            deleteArticle(article) {
                this.inputArticle.articles = this.inputArticle.articles.filter(x => { return x.id != article.id })
            },
            deleteArticleEmit() {
                this.deleteDialog = false
                this.$emit('deleteArticleEmit', this.inputArticle)
            }
        }
    }
</script>