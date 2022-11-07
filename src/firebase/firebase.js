import firebase from "firebase";

class Firebase {
  getOrders = () =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  postChats = (seller, buyer, message, productId, senderID) => {
    return new Promise(resolve => {
      firebase.database().
      ref('/chats/' + seller + '/' + productId + '/' + buyer + '/').
      push({
        content: message,
        timestamp: Date.now(),
        uid: senderID,
      }).
      then(() => {
        resolve(true)
      }).catch(error =>{
        resolve({})
      })
    })
  }

  storage = () => {
    return firebase.storage()
  }

  getRimiSenTitles = () =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/rimiLyrics/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  getReelOrderById = (id) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/'+id)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  updateSenTitle = (update) =>{
    return new Promise(resolve => {
      firebase.database()
      .ref(`/rimis/${update.id}/`)
      .update(
        {
          senTitle: update.newSenTitle,
        },
      )
      .then((response) => {
        return new Promise(resolve => {
          firebase.database()
          .ref(`/rimis/${update.id}/updates/${update.updateId}`)
          .remove()
          .then(() => {
            resolve(true)
          }).catch( (error) =>{
            console.log("error", error)
          })
        })
        .then((response) => {
          resolve(true)
        })
        .catch(error => {
          console.log("error", error)
        })
      })
      .catch(error => {
        console.log("error", error)
      })
    })

  }

  sendForApproval = (item) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/rimis/'+item.id+'/updates/' + item.updateId + '/')
      .set(item)
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  updateVideoSnippetURL = (orderId, snippetVideoURL) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/' + orderId + '/')
      .update({snippetVideoURL})
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  createbasiskitchenOrder = (reel) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/' + reel.id + '/')
      .set(
        {
          id: reel.id,
          emailAddress: reel.emailAddress,
          igname: reel.igname,
          firstName: reel.firstName,
          lastName: reel.lastName,
          reelPurpose: reel.reelPurpose,
          reelDuration: reel.reelDuration,
          reelSampleLink: reel.reelSampleLink,
          dueDateSelected: reel.dueDateSelected,
          selectedLevelOption: reel.selectedLevelOption,
          orderAudioURL: reel.orderAudioURL,
          statusValue: 0,
          snippetVideoURL: "",
        }
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }
}

export default new Firebase();
