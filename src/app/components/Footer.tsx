function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-gray-400 py-12 lg:mt-0 mt-[30rem]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        <div> 
          <h2 className="text-white text-lg font-semibold mb-4">About</h2>
          <p className="mb-4">
          DZ!NR & Developer by trade. I create visually stunning graphics
           and translate them into user-friendly interfaces and websites.
          Basically, I bridge the gap between beautiful design and smooth functionality.
          </p>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">Quick Links</h2>
          <ul>
            <li>
              <a
                href="/"
                className="hover:text-white transition-colors duration-300"
              >
                Home
              </a>
            </li>
           
            <li>
              <a
                href="/wd"
                className="hover:text-white transition-colors duration-300"
              >
             Web Developmnet
              </a>
            </li>
            <li>
              <a
                href="/ui-ux"
                className="hover:text-white transition-colors duration-300"
              >
                UI-UX Design
              </a>
            </li>
            <li>
              <a
                href="/gd"
                className="hover:text-white transition-colors duration-300"
              >
                Graphic Design
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">Follow</h2>
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/akhshad-gorle-628b63227/"
              className="hover:text-white transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href="https://www.behance.net/akhshadgorle"
              className="hover:text-white transition-colors duration-300"
            >
              Behance
            </a>
            <a
              href="https://www.instagram.com/akhshad_10/?utm_source=qr&r=nametag"
              className="hover:text-white transition-colors duration-300"
            >
              Instagram
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">Get in Touch</h2>
          <p>Nagpur, India</p>
          <p> 440002</p>
          <p>Email: akhshadgorle@gmail.com</p>
          <p>Phone: (+91) 9595431234</p>
        </div>
        </div>
        <p className="text-center text-sm pt-8">© 2024  All rights Reserved.</p>
        <p className="text-center pt-3 ">Designed & Developed by <span className="text-blue-400 hover:text-pink-500 font-bold">Akhshad Gorle</span></p>
    </footer>
  )
}

export default Footer
