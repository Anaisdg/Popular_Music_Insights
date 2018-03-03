

function updateImg(dataset) {
  var data = [];
  switch (dataset) {
    case "dataset1":
    data = ['p1','p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8','p9','p10'];
    break;
  case "dataset2":
    data = [ 'p11', 'p12', 'p14','p16','p17','p18','p19','p20','p21','p22'];
    break;
  case "dataset3":
    data = ['p23','p24','p25','p26','p27','p28','p29','p30','p31', 'p32'];
    break;
    case "dataset4":
    data = ['p33','p34','p35','p36','p37','p38','p39','p40','p41', 'p42'];
    break;
  case "dataset5":
    data = ['p43', 'p44','p45','p46','p47','p48','p49','p50','p51', 'p52'];
    break;
  case "dataset6":
    data = ['p53','p54','p55','p56','p57','p58','p59','p60','p61', 'p62'];
    break; 
  case "dataset7": 
    data = ['p63','p64','p65','p66','p67','p68','p69','p70','p71','p72']; 
    break;  
    
    case "dataset8":
    data = ['r2', 'r3', 'r5', 'r6', 'r7', 'r8','r9','r10','r11', 'r12'];
    break;
  case "dataset9":
    data = ['r13', 'r14','r15','r16','r17','r18','r19','r20','r21', 'r22'];
    break;
  case "dataset10":
    data = ['r23','r24','r25','r26','r27','r28','r29','r30','r31', 'r32'];
    break;
    case "dataset11":
    data = [ 'r33','r34','r35','r36','r37','r38','r39','r40','r41', 'r42'];
    break;
  case "dataset12":
    data = [ 'r43', 'r44','r45','r46','r47','r48','r49','r50','r51', 'r52'];
    break;
  case "dataset13":
    data = [ 'r53','r54','r55','r56','r57','r58','r59','r60','r61', 'r62'];
    break; 
  case "dataset14": 
    data = [ 'r63','r64','r65','r66','r67','r68','r69','r70','r71','r72']; 
    break; 
    case "dataset15":
    data = ['c1','c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8','c9','c10'];
    break;
  case "dataset16":
    data = [ 'c11', 'c12', 'c13', 'c14','c15','c16','c17','c18','c19','c20'];
    break;
  case "dataset17":
    data = ['c21', 'c22', 'c23','c24','c25','c26','c27','c28','c29','c30'];
    break;
    case "dataset18":
    data = ['c31', 'c32', 'c33','c34','c35','c36','c37','c38','c39','c40'];
    break;
  case "dataset19":
    data = ['c41', 'c42', 'c43', 'c44','c45','c46','c47','c48','c49','c50'];
    break;
  case "dataset20":
    data = ['c51', 'c52', 'c53','c54','c55','c56','c57','c58','c59','c60'];
    break; 
  case "dataset21": 
    data = ['c61', 'c62', 'c63','c64','c65','c66','c67','c68','c69','c70']; 
    break;    
  default:
      
}

return data;

};

function setImage(data) {    
    console.log(data);
    var ds = updateImg(data);
    console.log("ds: " + ds[0]);
    var images = {
       p46 : '(Everything I Do) I Do It for You.jpg',
       p12 : 'All Shook Up.jpg',
       p61 : 'Bad Day.jpg',
       p21 : 'Ballad of the Green Berets.jpg',
       p54 : 'Believe.jpg',
       p36 : 'Bette Davis Eyes.jpg',
       p7 : 'Blue Tango.jpg',
       p64 : 'Boom Boom pow.jpg',
       p55 : 'Breathe.jpg',
       p25 : 'Bridge over Troubled Water.jpg',
       p35 : 'Call Me.jpg',
       p52 : 'Candle in the Wind 1997 Something About the Way You Look Tonight.jpg',
       p40 : 'Careless Whisper.jpg',
       p10 : 'Cherry pink and Apple Blossom White.jpg',
       p47 : 'End of the Road.jpg',
       p38 : 'Every Breath You Take.jpg',
       p43 : 'Faith.jpg',
       p50 : 'Gangstas paradise.jpg',
       p5 : 'Goodnight, Irene.jpg',
       p56 : 'Hanging by a Moment.jpg',
       p69 : 'Happy.jpg',
       p11 : 'Heartbreak Hotel.jpg',
       p23 : 'Hey Jude.jpg',
       p45 : 'Hold On.jpg',
       p57 : 'How You Remind Me.jpg',
       p19 : 'I Want to Hold Your Hand.jpg',
       p48 : 'I Will Always Love You.jpg',
       p58 : 'In da Club.jpg',
       p62 : 'Irreplaceable.jpg',
       p26 : 'Joy to the World.jpg',
       p9 : 'Little Things Mean a Lot.jpg',
       p44 : 'Look Away.jpg',
       p30 : 'Love Will Keep Us Together.jpg',
       p71 : 'Love Yourself.jpg',
       p63 : 'Low.jpg',
       p51 : 'Macarena (Bayside Boys Mix).jpg',
       p34 : 'My Sharona.jpg',
       p2 : 'Near You.jpg',
       p37 : 'Physical.jpg',
       p1 : 'Prisoner of Love.jpg',
       p4 : 'Riders in the Sky.jpg',
       p66 : 'Rolling in the Deep.jpg',
       p33 : 'Shadow Dancing.jpg',
       p72 : 'Shape of You.jpg',
       p31 : 'Silly Love Songs.jpg',
       p67 : 'Somebody That I Used to Know.jpg',
       p8 : 'Song from Moulin Rouge.jpg',
       p17 : 'Stranger on the Shore.jpg',
       p18 : 'Sugar Shack.jpg',
       p24 : 'Sugar, Sugar.jpg',
       p41 : "That's What Friends Are For.jpg",
       p14 : 'The Battle of New Orleans.jpg',
       p27 : 'The First Time Ever I Saw Your Face.jpg',
       p49 : 'The Sign.jpg',
       p29 : 'The Way We Were.jpg',
       p68 : 'Thrift Shop.jpg',
       p28 : "Tie a Yellow Ribbon 'Round the Ole Oak Tree.jpg",
       p65 : 'Tik Tok.jpg',
       p22 : 'To Sir with Love.jpg',
       p32 : "Tonight's the Night (Gonna Be Alright).jpg",
       p53 : 'Too Close.jpg',
       p6 : 'Too Young.jpg',
       p16 : "Tossin' and Turnin'.jpg",
       p3 : 'Twelfth Street Rag.jpg',
       p70 : 'Uptown Funk.jpg',
       p42 : 'Walk Like an Egyptian.jpg',
       p60 : 'We Belong Together.jpg',
       p39 : 'When Doves Cry.jpg',
       p20 : 'Wooly Bully.jpg',
       p59 : 'Yeah!.jpg',
        r8: "(Mama) He Treats Your Daughter Mean.jpg",
        r2:"Ain't Nobody Here But Us Chickens.jpg",
        r61: "Be Without You.jpg",
        r64: "Blame it.jpg",
        r49: "Bump n' Grind.jpg",
        r47: "Come and Talk to Me.jpg",
        r50: "Creep.jpg",
        r31: "Disco Lady.jpg",
        r31: "Endless Love.jpg",
        r29: "Feel Like Makin' Love.jpg",
        r56: "Fiesta.jpg",
        r30: "Fight the Power Pt. 1.jpg",
        r32: "Float On.jpg",
        r57: "Foolish.jpg",
        r54: "Fortunate.jpg",
        r34: "Good Times.jpg",
        r69: "Happy.jpg",
        r21: "Hold On! I'm Comin'.jpg",
        r45: "Hold On.jpg",
        r11: "Honky Tonk.jpg",
        r20: "I Can't Help Myself (Sugar Pie Honey Bunch).jpg",
        r43: "I Want Her.jpg",
        r48: "I Will Always Love You.jpg",
        r25: "I'll Be There.jpg",
        r59: "If I Ain't Got You.jpg",
        r58: "In Da Club.jpg",
        r52: "In My Bed.jpg",
        r12: "Jailhouse Rock.jpg",
        r15: "Kiddio.jpg",
        r7: "Lawdy Miss Clawdy.jpg",
        r60: "Let Me Love You.jpg",
        r28: "Let's Get It On.jpg",
        r55: "Let's Get Married.jpg",
        r35: "Let's Get Serious.jpg",
        r27: "Let's Stay Together.jpg",
        r63: "Like You'll Never See Me Again.jpg",
        r3: "Long Gone.jpg",
        r62: "Lost Without U.jpg",
        r67: "Love on Top.jpg",
        r26: "Mr. Big Stuff.jpg",
        r19: "My Guy.jpg",
        r41: "On My Own.jpg",
        r71: "One Dance.jpg",
        r18: "Part Time Love.jpg",
        r5: "Pink Champagne.jpg",
        r10: "Pledging My Love.jpg",
        r22: "Respect.jpg",
        r40: "Rock Me Tonight (For Old Times Sake).jpg",
        r23: "Say It Loud  I'm Black and I'm Proud.jpg",
        r70: "See You Again.jpg",
        r33: "Serpentine Fire.jpg",
        r38: "Sexual Healing.jpg",
        r6: "Sixty Minute Man.jpg",
        r17: "Soul Twist.jpg",
        r14: "Stagger Lee.jpg",
        r42: "Stop to Love.jpg",
        r44: "Superwoman.jpg",
        r66: "Sure Thing.jpg",
        r37: "That Girl.jpg",
        r72: "That's What I Like.jpg",
        r68: "Thrift Shop.jpg",
        r53: "Too Close.jpg",
        r16: "Tossin' and Turnin'.jpg",
        r65: "UnThinkable (I'm Ready).jpg",
        r13: "What Am I Loving For.jpg",
        r24: "What does it take.jpg",
        r39: "When Doves Cry.jpg",
        r9: "Work With Me, Annie.jpg",
        r46: "Written All Over Your Face.jpg",
        r51: "You're Makin' Me High.jpg",
        c44: 'A Better Man.jpg',
        c56:"Ain't Nothing 'Bout You.jpg",
        c22:'All the Time.jpg',
        c21:'Almost Persuaded.jpg',
        c37:'Always on My Mind.jpg',
        c54:'Amazed.jpg',
        c72:'Body Like a Back Road.jpg',
        c3:'Bouquet of Roses.jpg',
        c48:'Chattahoochee.jpg',
        c6:'Cold, Cold Heart.jpg',
        c31:'Convoy.jpg',
        c11:'Crazy Arms.jpg',
        c66:'Crazy Girl.jpg',
        c68:'Cruise.jpg',
        c43:"Don't Close Your Eyes.jpg",
        c46:"Don't Rock the Jukebox.jpg",
        c26:'Easy Loving.jpg',
        c36:'Fire and Smoke.jpg',
        c23:'Folsom Prison Blues.jpg',
        c42:'Give Me Wings.jpg',
        c12:'Gone.jpg',
        c71:'H.O.L.Y..jpg',
        c25:"Hello Darlin'.jpg",
        c55:'How Do You Like Me Now.jpg',
        c9:"I Don't Hurt Anymore.jpg",
        c16:'I Fall to Pieces.jpg',
        c34:'I Just Fall in Love Again.jpg',
        c64:'I Run to You.jpg',
        c47:'I Saw the Light.jpg',
        c49:'I Swear.jpg',
        c5:"I'm Movin' On.jpg",
        c61:"If You're Going Through Hell (Before the Devil Even Knows).jpg",
        c10:'In the Jailhouse Now.jpg',
        c52:"It's Your Love.jpg",
        c38:'Jose Cuervo.jpg',
        c63: "Just Got Started Lovin' You.jpg",
        c53:'Just to See You Smile.jpg',
        c8:'Kaw Liga.jpg',
        c59:'Live Like You Were Dying.jpg',
        c40:'Lost in the Fifties Tonight.jpg',
        c65:'Love Like Crazy.jpg',
        c4:'Lovesick Blues.jpg',
        c32:'Luckenbach, Texas (Back to the Basics of Love).jpg',
        c33:"Mamas Don't Let Your Babies Grow Up to Be Cowboys.jpg",
        c58:'My Front Porch Looking In.jpg',
        c27:'My Hang Up Is You.jpg',
        c19:'My Heart Skips a Beat.jpg',
        c35:'My Heart.jpg',
        c24:'My Life (Throw It Away If I Want To).jpg',
        c51:'My Maria.jpg',
        c41:'Never Be You.jpg',
        c45:"Nobody's Home.jpg",
        c13:'Oh Lonesome Me.jpg',
        c15:"Please Help Me I'm Falling.jpg",
        c30:'Rhinestone Cowboy.jpg',
        c50:'Sold (The Grundy County Auction Incident).jpg',
        c18:'Still.jpg',
        c70:'Take Your Time.jpg',
        c60:"That's What I Love About Sunday.jpg",
        c14:'The Battle of New Orleans.jpg',
        c57:'The Good Stuff.jpg',
        c29:"There Won't Be Anymore.jpg",
        c69:'This Is How We Roll.jpg',
        c67:'Time Is Love.jpg',
        c39:"To All the Girls I've Loved Before.jpg",
        c62:'Watching You.jpg',
        c20:"What's He Doing in My World.jpg",
        c7:'Wild Side of Life.jpg',
        c17:'Wolverton Mountain.jpg',
        c28:"You've Never Been This Far Before.jpg"
        


    }; 
    
    for (var i = 0; i < 10; i++) {
        var $image = document.getElementById("img"+String(i+1));
        d3.select($image).attr('src',"img/" + images[ds[i]]);
        };

};