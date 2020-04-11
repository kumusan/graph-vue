<template>
  <v-container>
    <!--入力フォーム-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-container>
          <h2>名簿に追加する</h2>
          <v-form ref="form" v-model="valid" lazy-validation>
            <!--名前-->
            <v-text-field
              v-model="customer.name"
              :rules="nameRules"
              :counter="20"
              label="名前"
              required
            ></v-text-field>
            <!--性別-->
            <v-radio-group v-model="customer.gender" :rules="nameRules" row>
              <v-radio label="男性" value="男性"></v-radio>
              <v-radio label="女性" value="女性"></v-radio>
              <v-radio label="その他" value="その他"></v-radio>
            </v-radio-group>
            <!--追加ボタン-->
            <v-btn :disabled="!valid" @click="createCustomer">
              追加
            </v-btn>
            <v-btn @click="clear">クリア</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!--ツールバー-->
    <v-toolbar flat color="grey lighten-2">
      <v-toolbar-title>顧客名簿サンプル</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark class="mb-2" @click="showDialogNew"
        >新規追加</v-btn
      >
    </v-toolbar>

    <!-- データテーブル -->
    <v-data-table
      :headers="headers"
      :items="posts"
      no-data-text="顧客が登録されておりません。"
      class="elevation-1"
    >
      <v-progress-linear
        slot="progress"
        color="blue"
        indeterminate
      ></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.createdAt }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.gender }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { ALL_CUSTOMERS } from "../constants/customer-query";
import { CREATE_CUSTOMER } from "../constants/customer-mutation";

export default {
  name: "CustomerTable",
  data() {
    return {
      // 顧客情報
      posts: [],
      // テーブルのヘッダー情報
      headers: [
        { text: "追加日", value: "createdAt" },
        { text: "名前", value: "name" },
        { text: "性別", value: "gender" }
      ],
      // データテーブルの初期ソート、表示件数の設定
      pagination: {
        descending: true,
        rowsPerPage: 10
      },
      // フォーム入力値
      customer: {
        id: "",
        name: "",
        gender: ""
      },
      // バリデーション
      valid: true,
      nameRules: [
        v => !!v || "名前は必須項目です",
        v => (v && v.length <= 20) || "名前は20文字以内で入力してください"
      ],
      genderRules: [v => !!v || "性別は必須項目です"],
      // ローディングの表示フラグ
      progress: false,
      // ダイアログの表示フラグ
      dialog: false
    };
  },

  apollo: {
    // すべての顧客情報の取得
    posts: ALL_CUSTOMERS
  },

  methods: {
    // --------------------------------
    // 新規作成
    // --------------------------------
    createCustomer() {
      if (this.$refs.form.validate()) {
        this.progress = true;
        this.$apollo
          .mutate({
            mutation: CREATE_CUSTOMER,
            variables: {
              name: this.customer.name,
              gender: this.customer.gender
            }
          })
          .then(() => {
            this.$apollo.queries.posts.fetchMore({
              updateQuery: (previousResult, { fetchMoreResult }) => {
                return {
                  posts: fetchMoreResult.posts
                };
              }
            });
            this.dialog = false;
            this.progress = false;
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    // --------------------------------
    // フォームのクリア
    // --------------------------------
    clear() {
      // this.$refs.form.reset();
      console.log("test");
    },
    // --------------------------------
    // 新規追加ダイアログの表示
    // --------------------------------
    showDialogNew() {
      this.clear();
      this.dialog = true;
    }
  }
};
</script>
