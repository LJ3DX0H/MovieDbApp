using Microsoft.Toolkit.Mvvm.ComponentModel;
using Microsoft.Toolkit.Mvvm.Input;
using MovieDbApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace MovieDbApp.WpfClient
{
    public class MainWindowViewModel : ObservableRecipient
    {
        private string errorMessage;

        public string ErrorMessage
        {
            get { return errorMessage; }
            set { SetProperty(ref errorMessage, value); }
        }


        public RestCollection<Actor> Actors { get; set; }

        public RestCollection<Director> Directors { get; set; }

        public RestCollection<Movie> Movies { get; set; }

        public RestCollection<Role> Roles { get; set; }

        private Actor selectedActor;

        public Actor SelectedActor
        {
            get { return selectedActor; }
            set
            {
                if (value != null)
                {
                    selectedActor = new Actor()
                    {
                        ActorName = value.ActorName,
                        ActorId = value.ActorId
                    };
                    OnPropertyChanged();
                    (DeleteActorCommand as RelayCommand).NotifyCanExecuteChanged();
                }
            }
        }


        private Director selectedDirector;

        public Director SelectedDirector
        {
            get { return selectedDirector; }
            set
            {
                if(value != null)
                {
                    selectedDirector = new Director()
                    {
                        DirectorName = value.DirectorName,
                        DirectorId = value.DirectorId

                    };
                    OnPropertyChanged();
                    (DeleteDirectorCommand as RelayCommand).NotifyCanExecuteChanged();
                }
            }
        }
        
        private Movie selectedMovie;

        public Movie SelectedMovie
        {
            get { return selectedMovie; }
            set
            {
                if(value != null)
                {
                    selectedMovie = new Movie()
                    {
                        Title = value.Title,
                        MovieId = value.MovieId
                    };
                    OnPropertyChanged();
                    (DeleteMovieCommand as RelayCommand).NotifyCanExecuteChanged();
                }
            }
        }


        private Role selectedRole;

        public Role SelectedRole
        {
            get { return selectedRole; }
            set
            {
                if (value != null)
                {
                    selectedRole = new Role()
                    {
                        RoleName = value.RoleName,
                        RoleId = value.RoleId
                    };
                    OnPropertyChanged();
                    (DeleteRoleCommand as RelayCommand).NotifyCanExecuteChanged();
                }
            }
        }

        public ICommand CreateActorCommand { get; set; }

        public ICommand DeleteActorCommand { get; set; }

        public ICommand UpdateActorCommand { get; set; }

        public ICommand CreateDirectorCommand { get; set; }
        
        public ICommand DeleteDirectorCommand { get; set; } 

        public ICommand UpdateDirectorCommand { get; set; }

        public ICommand CreateMovieCommand { get; set; }  

        public ICommand DeleteMovieCommand { get; set; }    

        public ICommand UpdateMovieCommand { get; set; }

        public ICommand CreateRoleCommand { get; set; }

        public ICommand DeleteRoleCommand { get; set; }

        public ICommand UpdateRoleCommand { get; set; }

        public static bool IsInDesignMode
        {
            get
            {
                var prop = DesignerProperties.IsInDesignModeProperty;
                return (bool)DependencyPropertyDescriptor.FromProperty(prop, typeof(FrameworkElement)).Metadata.DefaultValue;
            }
        }


        public MainWindowViewModel()
        {
            if (!IsInDesignMode)
            {
                //Actors
                Actors = new RestCollection<Actor>("http://localhost:53910/", "actor", "hub");
                CreateActorCommand = new RelayCommand(() =>
                {
                    Actors.Add(new Actor()
                    {
                        ActorName = SelectedActor.ActorName
                    });
                });

                UpdateActorCommand = new RelayCommand(() =>
                {
                    try
                    {
                        Actors.Update(SelectedActor);
                    }
                    catch (ArgumentException ex)
                    {
                        ErrorMessage = ex.Message;
                    }
                    
                });

                DeleteActorCommand = new RelayCommand(() =>
                {
                    Actors.Delete(SelectedActor.ActorId);
                },
                () =>
                {
                    return SelectedActor != null;
                });
                SelectedActor = new Actor();

                //Directors
                Directors = new RestCollection<Director>("http://localhost:53910/", "director", "hub");
                CreateDirectorCommand = new RelayCommand(() =>
                {
                    Directors.Add(new Director()
                    {
                        DirectorName=SelectedDirector.DirectorName
                    });
                });

                UpdateDirectorCommand = new RelayCommand(() =>
                {
                    try
                    {
                        Directors.Update(SelectedDirector);
                    }
                    catch (ArgumentException ex)
                    {
                        ErrorMessage = ex.Message;
                    }
                });

                DeleteDirectorCommand = new RelayCommand(() =>
                {
                    Directors.Delete(SelectedDirector.DirectorId);
                },
                ()=>
                { 
                    return SelectedDirector != null;
                });

                //Movies
                Movies = new RestCollection<Movie>("http://localhost:53910/", "movie", "hub");
                CreateMovieCommand = new RelayCommand(() =>
                {
                    Movies.Add(new Movie()
                    {
                        Title = SelectedMovie.Title,
                    });
                });

                UpdateMovieCommand = new RelayCommand(() =>
                {
                    try
                    {
                        Movies.Update(SelectedMovie);
                    }
                    catch (ArgumentException ex)
                    {
                        ErrorMessage = ex.Message;
                    }
                });

                DeleteMovieCommand = new RelayCommand(() =>
                {
                    Movies.Delete(SelectedMovie.MovieId);
                },
                () =>
                {
                    return SelectedMovie != null;
                });

                //Roles
                Roles = new RestCollection<Role>("http://localhost:53910/", "role", "hub");
                CreateRoleCommand = new RelayCommand(() =>
                {
                    Roles.Add(new Role()
                    {
                        RoleName = SelectedRole.RoleName
                    });
                });

                UpdateRoleCommand = new RelayCommand(() =>
                {
                    try
                    {
                        Roles.Update(SelectedRole);
                    }
                    catch (ArgumentException ex)
                    {
                        ErrorMessage = ex.Message;
                    }
                });

                DeleteRoleCommand = new RelayCommand(() =>
                {
                    Roles.Delete(SelectedRole.RoleId);
                },
                () =>
                {
                    return SelectedRole != null;
                });
            }
            
        }
    }
}
