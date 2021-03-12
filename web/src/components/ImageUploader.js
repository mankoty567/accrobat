import React, { useRef } from 'react';
import { Card } from '@material-ui/core';

/**
 * Composant permettat d'uploader et faire un comportement directement derrière
 *
 * @param {Function} callback Fonction permettant de récupérer l'image pour exécuter une fonction ensuite avec derrière
 * @param {Boolean} preview Booléen permettant de prévisualiser l'image avant d'accepter
 * @param {JSX.Element} childs Permet d'ajouter des composants sous le composant afin de le personnaliser
 */
let ImageUploader = ({ callback, preview = false, childs }) => {
  let previewImg = useRef(null);
  let inputFile = useRef(null);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  let handleChange = () => {
    //Vérifie si on a un fichier
    if (inputFile.current.files.length === 1) {
      let file_img = inputFile.current.files[0];

      toBase64(file_img)
        .then((base64img) => {
          //Intégrer ici l'image
          preview ? (previewImg.current.src = base64img) : null;
          callback(file_img);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('Aucun fichier trouvé !');
    }
  };

  return (
    <Card style={{ padding: 10 }}>
      <input
        type="file"
        onChange={() => handleChange()}
        ref={inputFile}
      ></input>
      {preview ? (
        <>
          <p>Prévisualisation :</p>
          <img
            ref={previewImg}
            style={{ width: '80%', height: '80%' }}
          ></img>
        </>
      ) : null}
      {childs ? childs : null}
    </Card>
  );
};

export default ImageUploader;
