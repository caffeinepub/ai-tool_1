import Map "mo:core/Map";
import Set "mo:core/Set";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type LetterType = {
    #officeLetter;
    #governmentPressNote;
    #application;
    #petition;
    #complaintLetter;
    #informationRequestLetter;
    #certificateOfAppreciation;
  };

  module LetterType {
    public func compare(letterType1 : LetterType, letterType2 : LetterType) : Order.Order {
      let toNat = func(letterType : LetterType) : Nat {
        switch (letterType) {
          case (#officeLetter) { 0 };
          case (#governmentPressNote) { 1 };
          case (#application) { 2 };
          case (#petition) { 3 };
          case (#complaintLetter) { 4 };
          case (#informationRequestLetter) { 5 };
          case (#certificateOfAppreciation) { 6 };
        };
      };
      Nat.compare(toNat(letterType1), toNat(letterType2));
    };
  };

  type LetterContent = {
    id : Nat;
    owner : Principal;
    title : Text;
    letterType : LetterType;
    content : Text;
    fontFamily : Text;
    tone : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  module LetterContent {
    public func compare(letter1 : LetterContent, letter2 : LetterContent) : Order.Order {
      Nat.compare(letter1.id, letter2.id);
    };

    public func compareByLetterType(letter1 : LetterContent, letter2 : LetterContent) : Order.Order {
      switch (LetterType.compare(letter1.letterType, letter2.letterType)) {
        case (#equal) { Text.compare(letter1.title, letter2.title) };
        case (order) { order };
      };
    };
  };

  var nextLetterId = 0;
  let letters = Map.empty<Nat, LetterContent>();
  let letterTypeToLetterIds = Map.empty<LetterType, Set.Set<Nat>>();

  func hasLetterPermission(caller : Principal, letter : LetterContent) : Bool {
    switch (AccessControl.getUserRole(accessControlState, caller)) {
      case (#admin) { true };
      case (#user) { Principal.equal(caller, letter.owner) };
      case (#guest) { false };
    };
  };

  func getLetterInternal(letterId : Nat) : LetterContent {
    switch (letters.get(letterId)) {
      case (null) { Runtime.trap("Letter not found for ID: " # letterId.toText()) };
      case (?letter) { letter };
    };
  };

  func getAccessibleLetters(caller : Principal) : [LetterContent] {
    letters.values().toArray().filter(
      func(letter) { hasLetterPermission(caller, letter) }
    );
  };

  func addLetterToTypeIndex(letterType : LetterType, letterId : Nat) {
    var letterIds = switch (letterTypeToLetterIds.get(letterType)) {
      case (null) { Set.empty<Nat>() };
      case (?ids) { ids };
    };
    letterIds.add(letterId);
    letterTypeToLetterIds.add(letterType, letterIds);
  };

  func removeLetterFromTypeIndex(letterType : LetterType, letterId : Nat) {
    switch (letterTypeToLetterIds.get(letterType)) {
      case (null) {};
      case (?letterIds) {
        letterIds.remove(letterId);
        let newLetterIds = letterIds.difference(Set.singleton<Nat>(letterId));
        if (not newLetterIds.isEmpty<Nat>()) {
          letterTypeToLetterIds.add(letterType, newLetterIds);
        } else {
          letterTypeToLetterIds.remove(letterType);
        };
      };
    };
  };

  func updateLetterTypeIndex(letterId : Nat, oldType : LetterType, newType : LetterType) {
    if (oldType != newType) {
      removeLetterFromTypeIndex(oldType, letterId);
      addLetterToTypeIndex(newType, letterId);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Letter Management

  public shared ({ caller }) func createLetter(creationRequest : {
    title : Text;
    letterType : LetterType;
    content : Text;
    fontFamily : Text;
    tone : Text;
  }) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create letters.");
    };
    if (creationRequest.title == "") {
      Runtime.trap("Letter title cannot be empty.");
    };
    if (creationRequest.content == "") {
      Runtime.trap("Letter content cannot be empty.");
    };
    let id = nextLetterId;
    nextLetterId += 1;

    let letter : LetterContent = {
      id;
      owner = caller;
      title = creationRequest.title;
      letterType = creationRequest.letterType;
      content = creationRequest.content;
      fontFamily = creationRequest.fontFamily;
      tone = creationRequest.tone;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    letters.add(id, letter);
    addLetterToTypeIndex(creationRequest.letterType, id);
    id;
  };

  public query ({ caller }) func getAllLetters() : async [LetterContent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view letters.");
    };
    getAccessibleLetters(caller).sort();
  };

  public query ({ caller }) func getLetterById(letterId : Nat) : async LetterContent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view letters.");
    };
    let letter = getLetterInternal(letterId);
    if (not (hasLetterPermission(caller, letter))) {
      Runtime.trap("Unauthorized: You do not have permission to access this letter.");
    };
    letter;
  };

  public shared ({ caller }) func updateLetter(updateRequest : {
    id : Nat;
    title : Text;
    letterType : LetterType;
    content : Text;
    fontFamily : Text;
    tone : Text;
  }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update letters.");
    };
    let existingLetter = getLetterInternal(updateRequest.id);
    if (not (hasLetterPermission(caller, existingLetter))) {
      Runtime.trap("Unauthorized: You do not have permission to update this letter.");
    };

    let updatedLetter : LetterContent = {
      existingLetter with
      title = updateRequest.title;
      letterType = updateRequest.letterType;
      content = updateRequest.content;
      fontFamily = updateRequest.fontFamily;
      tone = updateRequest.tone;
      updatedAt = Time.now();
    };
    letters.add(updateRequest.id, updatedLetter);

    if (updateRequest.letterType != existingLetter.letterType) {
      updateLetterTypeIndex(updateRequest.id, existingLetter.letterType, updateRequest.letterType);
    };
  };

  public shared ({ caller }) func deleteLetter(letterId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete letters.");
    };
    let letter = getLetterInternal(letterId);
    if (not (hasLetterPermission(caller, letter))) {
      Runtime.trap("Unauthorized: You do not have permission to delete this letter.");
    };
    letters.remove(letterId);
    removeLetterFromTypeIndex(letter.letterType, letterId);
  };

  public query ({ caller }) func getLettersByType(letterType : LetterType) : async [LetterContent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view letters.");
    };
    let letterIds = switch (letterTypeToLetterIds.get(letterType)) {
      case (null) { Set.empty<Nat>() };
      case (?ids) { ids };
    };

    letterIds.values().toArray().map(
      func(letterId) {
        if (letterId >= nextLetterId) {
          Runtime.trap("Invalid letter id: " # letterId.toText());
        };
        getLetterInternal(letterId);
      }
    ).filter(
      func(letter) { hasLetterPermission(caller, letter) }
    ).sort();
  };

  public query ({ caller }) func searchLettersByTitle(searchTerm : Text) : async [LetterContent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can search letters.");
    };
    getAccessibleLetters(caller).filter(
      func(letter) {
        letter.title.contains(#text(searchTerm));
      }
    ).sort();
  };

  public query ({ caller }) func getAccessibleLettersSortedByType() : async [LetterContent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view letters.");
    };
    getAccessibleLetters(caller).sort(LetterContent.compareByLetterType);
  };
};
