import style from './Loader.module.css';

export default function Loader() {
  return (
    <div className={style["custom-loader"]}>
      <div className={style["custom-loader__box"]} />
    </div>
  );
};
