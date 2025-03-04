import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';


const NOMBRE_COLONNES = 8;
const NOMBRE_LIGNES = 8;


const DIAMANTS = [
  require('../assets/images/Diamant1.png'),
  require('../assets/images/Diamant2.png'),
  require('../assets/images/Diamant3.png'),
  require('../assets/images/Diamant4.png'),
  require('../assets/images/Diamant5.png'),
  require('../assets/images/Diamant6.png'),
  require('../assets/images/Diamant7.png'),
  require('../assets/images/Diamant8.png'),
];

class Grille extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      grille: this.genererGrille(), 
      celluleSelectionnee: null, 
    };
  }

  
  genererGrille() {
    let grille = [];
  
    for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
      let ligneArray = [];
      for (let colonne = 0; colonne < NOMBRE_COLONNES; colonne++) {
        let diamant;
        do {
          diamant = Math.floor(Math.random() * 8); 
        } while (
          (colonne >= 2 && diamant === ligneArray[colonne - 1] && diamant === ligneArray[colonne - 2]) ||
          (ligne >= 2 && diamant === grille[ligne - 1][colonne] && diamant === grille[ligne - 2][colonne])
        );
  
        ligneArray.push(diamant);
      }
      grille.push(ligneArray);
    }
  
    return grille;
  }
  
  
  echangerImages(ligne, colonne) {
    const { celluleSelectionnee, grille } = this.state;
  
    if (celluleSelectionnee) {
      const [lignePrecedente, colonnePrecedente] = celluleSelectionnee;
  
      // Vérifie si l'échange est valide (cases adjacentes)
      if (
        (Math.abs(ligne - lignePrecedente) === 1 && colonne === colonnePrecedente) ||
        (Math.abs(colonne - colonnePrecedente) === 1 && ligne === lignePrecedente)
      ) {
        let nouvelleGrille = [...grille];
  
       
        let temporaire = nouvelleGrille[lignePrecedente][colonnePrecedente];
        nouvelleGrille[lignePrecedente][colonnePrecedente] = nouvelleGrille[ligne][colonne];
        nouvelleGrille[ligne][colonne] = temporaire;
  
        // Vérifie si un alignement est créé après l'échange
        if (this.verifierAlignements(nouvelleGrille)) {
          this.setState({ grille: nouvelleGrille, celluleSelectionnee: null });
        } else {
          // Annule l'échange si aucun alignement n'est créé
          nouvelleGrille[ligne][colonne] = nouvelleGrille[lignePrecedente][colonnePrecedente];
          nouvelleGrille[lignePrecedente][colonnePrecedente] = temporaire;
          this.setState({ celluleSelectionnee: null });
        }
      } else {
        this.setState({ celluleSelectionnee: [ligne, colonne] });
      }
    } else {
      this.setState({ celluleSelectionnee: [ligne, colonne] });
    }
  }
  

  verifierAlignements() {
    let nouvelleGrille = [...this.state.grille];
    let alignementsTrouves = false;
  
    // Vérifier les alignements sur les lignes
    for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
      for (let colonne = 0; colonne < NOMBRE_COLONNES - 2; colonne++) {
        let longueurAlignement = 1;
  
        while (
          colonne + longueurAlignement < NOMBRE_COLONNES &&
          nouvelleGrille[ligne][colonne] === nouvelleGrille[ligne][colonne + longueurAlignement]
        ) {
          longueurAlignement++;
        }
  
        if (longueurAlignement >= 3) {
          // Remplacer les éléments alignés
          for (let i = 0; i < longueurAlignement; i++) {
            nouvelleGrille[ligne][colonne + i] = null;
          }
          alignementsTrouves = true;
        }
      }
    }
  
    // Vérifier les alignements sur les colonnes
    for (let colonne = 0; colonne < NOMBRE_COLONNES; colonne++) {
      for (let ligne = 0; ligne < NOMBRE_LIGNES - 2; ligne++) {
        let longueurAlignement = 1;
  
        while (
          ligne + longueurAlignement < NOMBRE_LIGNES &&
          nouvelleGrille[ligne][colonne] === nouvelleGrille[ligne + longueurAlignement][colonne]
        ) {
          longueurAlignement++;
        }
  
        if (longueurAlignement >= 3) {
          // Remplacer les éléments alignés
          for (let i = 0; i < longueurAlignement; i++) {
            nouvelleGrille[ligne + i][colonne] = null;
          }
          alignementsTrouves = true;
        }
      }
    }
  
    if (alignementsTrouves) {
      for (let colonne = 0; colonne < NOMBRE_COLONNES; colonne++) {
        let nouvelleColonne = [];
    
        // Récupérer tous les diamants non-nul de la colonne
        for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
          if (nouvelleGrille[ligne][colonne] !== null) {
            nouvelleColonne.push(nouvelleGrille[ligne][colonne]);
          }
        }
    
        // Compléter avec de nouveaux diamants
        while (nouvelleColonne.length < NOMBRE_LIGNES) {
          nouvelleColonne.unshift(Math.floor(Math.random() * 8)); // Ajouter en haut
        }
    
        // Remettre la colonne mise à jour dans la grille
        for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
          nouvelleGrille[ligne][colonne] = nouvelleColonne[ligne];
        }
      }
    
      // Mettre à jour la grille après modification
      this.setState({ grille: nouvelleGrille });
    }
    
    return alignementsTrouves;
  }
    

  render() {
    let elementsGrille = []; 
  
    for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
      let elementsLigne = []; 
  
      for (let colonne = 0; colonne < NOMBRE_COLONNES; colonne++) {
        elementsLigne.push(
          <TouchableOpacity
            key={`${ligne}-${colonne}`}
            onPress={() => this.echangerImages(ligne, colonne)}
          >
            <Image
              source={DIAMANTS[this.state.grille[ligne][colonne]]}
              style={styles.cellule}
            />
          </TouchableOpacity>
        );
      }
  
     
      elementsGrille.push(
        <View key={ligne} style={styles.ligne}>
          {elementsLigne}
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        {elementsGrille}
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  ligne: {
    flexDirection: 'row',
  },
  cellule: {
    width: 50,
    height: 50,
    margin: 2,
    borderWidth: 2, 
    borderColor: '#000', 
  },
});

export default Grille;
