<?php

    $title = "About";
    session_start();

    include "header.php";

?>      <!-- Example row of columns -->
      <div class="row">
        <div class="span6">
          <h2>Inspiration</h2>
          <p>The idea for this app came from a
          <a href="http://www.stern.de/tv/sterntv/schnueffeln-per-facebook-app-so-schnell-wird-privates-oeffentlich-1951237.html">
            rather lurid story</a> in stern, a german print magazin.</p>
        </div>
        <div class="span6">
          <h2>Purpose</h2>
          <p>I don't want to make you angry at facebook.
            That facebook knows a lot about you, and that it
            gives this information to others on your behest,
            or sells it, is not the important problem.</p>

            <p>Go watch <a href="https://www.youtube.com/watch?v=DJjPzyo3osg">Eben Moglens talk</a>
            for a deeper analysis!</p> 
         </div>
      </div>
<?php
    include "footer.php";
?>
