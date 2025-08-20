import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon } from "./utils/pokemon.jsx"; //ポケモンのデータを取得する関数をインポート
import { getPokemon } from "./utils/pokemon.jsx"; //ポケモンの詳細データを取得する関数をインポート
import Card from "./components/Card.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true); //データの読み込み状態を管理するためのステート
  const [pokemonData, setPokemonData] = useState([]); //ポケモンのデータを管理するためのステート
  const [nextURL, setNextURL] = useState(""); //次のページのURLを管理するためのステート
  const [prevURL, setPrevURL] = useState(""); //前のページのURLを管理するためのステート

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンのデータを取得する
      let res = await getAllPokemon(initialURL);
      //各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      // console.log(res.next);
      setNextURL(res.next);
      setPrevURL(res.previous);
      //ここで取得したデータを使って、ポケモンのリストを表示するなどの処理を行う
      setLoading(false); //データの読み込みが完了したら、loadingをfalseに設定
    };
    fetchPokemonData();
  }, []); //空の配列を渡すことで、コンポーネントのマウント時にのみ実行される

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      //各ポケモンの詳細データを非同期に取得し終わるまで待つ
      data.map((pokemon) => {
        // console.log(pokemon);
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData); //取得したポケモンの詳細データをステートに保存
  };
  // console.log(pokemonData); //ポケモンの詳細データをコンソールに表示

  const handleNextPage = async () => {
    setLoading(true); //前のページのポケモンデータを取得する前にloadingをtrueに設定
    let data = await getAllPokemon(nextURL); //nextURLからポケモンデータを取得
    console.log(data);
    await loadPokemon(data.results); //取得したポケモンの詳細データをロード
    setNextURL(data.next); //次のページのURLを更新
    setPrevURL(data.previous); //前のページのURLを更新
    setLoading(false); //データの読み込みが完了したら、loadingをfalseに設定
    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = async () => {
    if (!prevURL) return; //前のページがない場合は何もしない
    setLoading(true); //前のページのポケモンデータを取得する前にloadingをtrueに設定
    let data = await getAllPokemon(prevURL); //prevURLからポケモンデータを取得
    console.log(data);
    await loadPokemon(data.results); //取得したポケモンの詳細データをロード
    setNextURL(data.next); //次のページのURLを更新
    setPrevURL(data.previous); //前のページのURLを更新
    setLoading(false); //データの読み込みが完了したら、loadingをfalseに設定
    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中...</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                //iはインデックス番号
                return <Card key={i} pokemon={pokemon} />; //Cardコンポーネントにポケモンのデータを渡す
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
