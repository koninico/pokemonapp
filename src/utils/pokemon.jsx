export const getAllPokemon = (url) => {
  return new Promise((resolve, reject) => { //resolve：成功、reject：失敗
    fetch(url)
      .then((res) => res.json())
      .then((data) => resolve(data))//json形式に変換してからresolveする
  });
};

export const getPokemon = (url) => {

  return new Promise((resolve, reject) => { //resolve：成功、reject：失敗
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        resolve(data)
        // console.log(data); //取得したポケモンの詳細データをコンソールに表示
      })//json形式に変換してからresolveする
  });
};