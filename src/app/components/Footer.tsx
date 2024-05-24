function Footer() {
  return (
    <footer className="bg-my-custom-gray text-gray-400 py-12 lg:mt-0 mt-[30rem]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        <div> 
          <h2 className="text-white text-lg font-semibold mb-4">About Us</h2>
          <p className="mb-4">
          DZ!NR & developer by trade. I create visually stunning graphics
           and translate them into user-friendly interfaces and websites.
          Basically, I bridge the gap between beautiful design and smooth functionality.
          </p>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">Quick Links</h2>
          <ul>
            <li>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
              Portfolio
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">Follow</h2>
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Twitter
            </a>
            <a
              href="#"
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
        <p className="text-center pt-3 ">Designed & Developed by <span className="text-pink-500 font-bold">Akhshad Gorle</span></p>
    </footer>
  )
}

export default Footer
