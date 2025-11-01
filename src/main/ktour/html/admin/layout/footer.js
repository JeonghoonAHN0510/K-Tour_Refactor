 /**
 * [ footer 레이아웃(HTML) import ]
 *
 * @author kimJS
 * @since 2025.10.13
 */

 function footer(){ 
    console.log( '[4] footer 레이아웃(HTML)' );
    const contentsWrapHTML = document.querySelector('.contentsWrap');
    const footerHTML = `   
        <!-- footer start -->
        <footer>
            <small>&copy; 2025 Root.Lab</small>
        </footer>
        <!-- footer end -->
    </div>
    <!-- container end -->
    </body>
    </html>
    `
    contentsWrapHTML.insertAdjacentHTML('afterend', footerHTML);

 }//func end

 footer(); //js 실행
